import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const mockAuthService = {
      verifyFirebaseToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should call verifyFirebaseToken and return result', async () => {
    const idToken = 'mock-id-token';
    const mockResponse = { uid: 'user123', email: 'test@example.com' } as any;
    jest.spyOn(authService, 'verifyFirebaseToken').mockResolvedValue(mockResponse);

    const result = await authController.firebaseLogin({ idToken });
    expect(authService.verifyFirebaseToken).toHaveBeenCalledWith(idToken);
    expect(result).toEqual(mockResponse);
  });
});
