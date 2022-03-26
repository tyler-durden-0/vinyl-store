import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserModule } from "../dist/user/user.module";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserEntity } from "../dist/user/user.entity";
import { VinylEntity } from "../dist/vinyl/vinyl.entity";
import { ReviewEntity } from "../dist/review/review.entity";

const oneUser = {
  email: "test@email.ru",
  password: "test",
  firstName: "test",
  lastName: "test",
  birthDate: "11.11.2001",
  avatar: "test",
  isAdmin: false
}

const oneVinyl = {
  // id: 1,
  price: 10,
  name: 'Life Goes On',
  authorName: 'Oliver Tree',
  description: 'test',
  image: 'test'
}

const oneVinylEntity = {
  // id: 1,
  price: 10,
  name: 'Life Goes On',
  authorName: 'Oliver Tree',
  description: 'test',
  image: 'test'
}

const oneReview = {
  comment: 'test',
  score: 5,
  authorName: 'test',
}

describe('VinylController (e2e)', () => {
  let app: INestApplication;

  const mockUserRepository = {
    findOne: jest.fn().mockImplementation(() => oneUser)
  }
  const mockVinylRepository = {
    find: jest.fn().mockImplementation(() => oneVinyl),
    findOne: jest.fn().mockImplementation(() => oneVinylEntity)
  }
  const mockReviewRepository = {
    find: jest.fn().mockImplementation(() => oneReview)
  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UserModule]
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

  it('/api/vinyls (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/vinyls')
      .expect(200)
  });

  // it('/api/vinyls/sort? (GET)', () => {
  //   return request(app.getHttpServer())
  //     .get('/api/vinyls/sort?')
  //     .query('price=cheap')
  //     .expect(200)
  // });

});
