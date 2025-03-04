import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import * as admin from 'firebase-admin';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let usersRepository: Repository<User>;
  let firebaseAdmin: admin.app.App;

  beforeEach(async () => {
    const mockJwtService = {
      sign: jest.fn().mockReturnValue('mocked-jwt-token'),
    };

    const mockFirebaseAdmin = {
      auth: jest.fn().mockReturnValue({
        verifyIdToken: jest.fn(),
      }),
    };

    const mockUsersRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: 'FIREBASE_ADMIN', useValue: mockFirebaseAdmin },
        { provide: JwtService, useValue: mockJwtService },
        { provide: getRepositoryToken(User), useValue: mockUsersRepository },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    firebaseAdmin = module.get<admin.app.App>('FIREBASE_ADMIN');
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should verify Firebase token and return JWT for an existing user', async () => {
    const mockDecodedToken: any = { uid: 'firebase-uid', name: 'John Doe', email: 'john@example.com' };
    const mockUser: any = { id: 1, providerId: 'firebase-uid', name: 'John Doe', email: 'john@example.com' };

    jest.spyOn(firebaseAdmin.auth(), 'verifyIdToken').mockResolvedValue(mockDecodedToken);
    jest.spyOn(usersRepository, 'findOne').mockResolvedValue(mockUser);

    const result = await authService.verifyFirebaseToken('valid-token');

    expect(result).toEqual({ token: 'mocked-jwt-token', user: mockUser });
    expect(usersRepository.findOne).toHaveBeenCalledWith({ where: { providerId: 'firebase-uid' } });
  });

  it('should create a new user if not found', async () => {
    const mockDecodedToken: any = { uid: 'firebase-uid', name: 'Jane Doe', email: 'jane@example.com' };
    const mockNewUser: any = { id: 2, providerId: 'firebase-uid', name: 'Jane Doe', email: 'jane@example.com' };

    jest.spyOn(firebaseAdmin.auth(), 'verifyIdToken').mockResolvedValue(mockDecodedToken);
    jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);
    jest.spyOn(usersRepository, 'create').mockReturnValue(mockNewUser);
    jest.spyOn(usersRepository, 'save').mockResolvedValue(mockNewUser);

    const result = await authService.verifyFirebaseToken('valid-token');

    expect(result).toEqual({ token: 'mocked-jwt-token', user: mockNewUser });
    expect(usersRepository.create).toHaveBeenCalledWith(expect.objectContaining({ providerId: 'firebase-uid' }));
    expect(usersRepository.save).toHaveBeenCalledWith(mockNewUser);
  });

  it('should throw UnauthorizedException for an invalid token', async () => {
    jest.spyOn(firebaseAdmin.auth(), 'verifyIdToken').mockRejectedValue(new Error('Invalid token'));

    await expect(authService.verifyFirebaseToken('invalid-token')).rejects.toThrow(UnauthorizedException);
  });
});
