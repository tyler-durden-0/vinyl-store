import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';

describe('AppController', () => {
  let appController: AppController;

  const mockAppService = {};
  const mockAuthService = {};

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, AuthService],
    })
      .overrideProvider(AppService)
      .useValue(mockAppService)
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    // it('should return registered information', () => {
    //   expect(appController.googleAuthRedirect()).toBe('Hello World!');
    // });
    it('should be defined', () => {
      expect(appController).toBeDefined();
    });
  });
});
