import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    register: jest.fn((payload) => {
      return {
        id: Date.now(),
        ...payload,
        checkPayment: 'null',
        checkVinylId: 'null',
      };
    }),
    login: jest.fn((payload) => {
      return {
        access_token: `${payload.email}+${payload.pass}_token`,
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register user', () => {
    expect(
      controller.register({
        email: 'test@mail.com',
        password: 'test',
        firstName: 'test',
        lastName: 'test',
        birthDate: '01.10.2000',
        avatar: 'test.jpg',
        isAdmin: false,
      }),
    ).toEqual({
      id: expect.any(Number),
      email: 'test@mail.com',
      password: 'test',
      firstName: 'test',
      lastName: 'test',
      birthDate: '01.10.2000',
      avatar: 'test.jpg',
      isAdmin: false,
      checkPayment: 'null',
      checkVinylId: 'null',
    });
  });

  it('should return token', () => {
    expect(
      controller.login({ email: 'test@mail.com', pass: '123qweasd' }),
    ).toEqual({ access_token: 'test@mail.com+123qweasd_token' });
  });
});
