import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { VinylService } from '../vinyl/vinyl.service';
import { ReviewService } from '../review/review.service';

describe('UserService', () => {
  let service: UserService;

  const mockUserRepo = {};
  const mockVinylService = {};
  const mockReviewService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        VinylService,
        ReviewService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepo,
        },
      ],
    })
      .overrideProvider(VinylService)
      .useValue(mockVinylService)
      .overrideProvider(ReviewService)
      .useValue(mockReviewService)
      .compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
