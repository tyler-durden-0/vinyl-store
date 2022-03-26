import { Test, TestingModule } from '@nestjs/testing';
import { VinylController } from './vinyl.controller';
import { VinylService } from './vinyl.service';
import { UserService } from '../user/user.service';

describe('VinylController', () => {
  let controller: VinylController;

  const mockVinylService = {};
  const mockUserService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VinylController],
      providers: [VinylService, UserService],
    })
      .overrideProvider(VinylService)
      .useValue(mockVinylService)
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<VinylController>(VinylController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
