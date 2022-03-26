import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;

  const mockUserService = {
    findUserByEmail: jest.fn().mockImplementation(dto => dto)
  };
  const mockJwtService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UserService, JwtService],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .overrideProvider(JwtService)
      .useValue(mockJwtService)
      .compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // it('register', async () => {
  //   const user = await service.register(candidate)
  //   const testUser = {
  //     email: user.email,
  //     firstName: user.firstName,
  //     lastName: user.lastName,
  //     birthDate: user.birthDate,
  //     avatar: user.avatar,
  //     isAdmin: user.isAdmin
  //   }
  //   const testCandidate = {
  //     email: candidate.email,
  //     firstName: candidate.firstName,
  //     lastName: candidate.lastName,
  //     birthDate: candidate.birthDate,
  //     avatar: candidate.avatar,
  //     isAdmin: candidate.isAdmin
  //   }
  //   expect(testUser).toEqual(testCandidate)
  // })
});
