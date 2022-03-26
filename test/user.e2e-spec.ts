import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserModule } from "../dist/user/user.module";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserEntity } from "../dist/user/user.entity";
import { VinylEntity } from "../dist/vinyl/vinyl.entity";
import { ReviewEntity } from "../dist/review/review.entity";

const editUser = {
  firstName: 'test'
}

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
   price: 10,
   name: 'test',
   authorName: 'test',
   description: 'test',
   image: 'test'
}

describe('UserController (e2e)', () => {
  let app: INestApplication;

  const mockUserRepository = {
    findOne: jest.fn().mockImplementation(() => oneUser)
  }
  const mockVinylRepository = {
    find: jest.fn().mockImplementation(() => oneVinyl),
    filter: jest.fn().mockImplementation(() => oneVinyl)
  }
  const mockReviewRepository = {}

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

    const req = await request(app.getHttpServer()).post('/api/auth/login').send({email:'test@email.ru', pass:'test'})
    console.log(req.body)
  });

  it('/api/users/profile (GET) without token', () => {
    return request(app.getHttpServer())
      .get('/api/users/profile')
      .expect(401)
  });

  it('/api/users/profile/edit (PATCH) without token', () => {
    return request(app.getHttpServer())
      .patch('/api/users/profile/edit')
      .set(editUser)
      .expect(401)
  });

});
