import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserEntity } from "../dist/user/user.entity";
import { VinylEntity } from "../dist/vinyl/vinyl.entity";
import { ReviewEntity } from "../dist/review/review.entity";

describe('AppController (e2e)', () => {
  let app: INestApplication;

  const mockUserRepository = {}
  const mockVinylRepository = {}
  const mockReviewRepository = {}

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getRepositoryToken(UserEntity))
      .useValue(mockUserRepository)
      .overrideProvider(getRepositoryToken(VinylEntity))
      .useValue(mockVinylRepository)
      .overrideProvider(getRepositoryToken(ReviewEntity))
      .useValue(mockReviewRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(302)
  });
});
