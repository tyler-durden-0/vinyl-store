import { Test, TestingModule } from '@nestjs/testing';
import { VinylService } from './vinyl.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VinylEntity } from './vinyl.entity';
import { UserService } from '../user/user.service';
import { ReviewService } from '../review/review.service';
import { StripeService } from '../stripe/stripe.service';
import { MailService } from '../mail/mail.service';

describe('VinylService', () => {
  let service: VinylService;

  const mockVinylRepo = {};
  const mockUserService = {};
  const mockReviewService = {};
  const mockStripeService = {};
  const mockMailService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VinylService,
        UserService,
        ReviewService,
        StripeService,
        MailService,
        {
          provide: getRepositoryToken(VinylEntity),
          useValue: mockVinylRepo,
        },
      ],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .overrideProvider(ReviewService)
      .useValue(mockReviewService)
      .overrideProvider(StripeService)
      .useValue(mockStripeService)
      .overrideProvider(MailService)
      .useValue(mockMailService)
      .compile();

    service = module.get<VinylService>(VinylService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
