import {Test, TestingModule} from '@nestjs/testing';
import {UsersService} from './users.service';
import {User} from "./user.entity";
import {getRepositoryToken} from "@nestjs/typeorm";

describe('UsersService', () => {
  let service: UsersService;
  const mockRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn().mockResolvedValue({ id: 1, name: 'John Doe', email: 'test@email.com' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return user by ID', async () => {
    const user = await service.findOrCreate({id: '1'}, 'test');
    expect(user).toBeDefined();
    expect(user?.id).toBe(1);
    expect(user?.name).toBe('John Doe');
  });
});
