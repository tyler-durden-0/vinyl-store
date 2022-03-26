import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from "../dist/auth/auth.module";
import { getRepositoryToken } from "@nestjs/typeorm";
import { VinylEntity } from "../dist/vinyl/vinyl.entity";
import { ReviewEntity } from "../dist/review/review.entity";
import { UserEntity } from "../dist/user/user.entity";

const oneUser = {
  email: "test@email.ru",
  password: "test",
  firstName: "test",
  lastName: "test",
  birthDate: "11.11.2001",
  avatar: "test",
  isAdmin: false
}

const loginUser = {
  email: "test@email.ru",
  pass: "test",
}

const notUser = {}

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  const mockUserRepository = {
    findOne: jest.fn(() => notUser)
  }
  const mockVinylRepository = {}
  const mockReviewRepository = {}

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule]
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

  it('/api/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .set(loginUser)
      .expect(201)
  });

  it('/api/auth/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/auth/register')
      .set(oneUser)
      .expect(400)
  });
});
