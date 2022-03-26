import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCreatePayloadDto } from './dto/UserCreatePayloadDto';
import { IProfileUpdateWithIdPayload } from './interfaces/IProfileUpdateWithIdPayload';
import { VinylEntity } from '../vinyl/vinyl.entity';
import { VinylService } from '../vinyl/vinyl.service';
import { IUserEntityWithReviewsAndVinylsToUser } from '../mappers/interfaces/IUserEntityWithReviewsAndVinylsToUser';
import { userEntityToUser } from '../mappers/userEntityToUser';
import { IProfileOutput } from '../mappers/interfaces/IProfileOutput';
import { ReviewEntity } from '../review/review.entity';
import { ReviewService } from '../review/review.service';
import { IUpdateCheckInfoForStripe } from './interfaces/IUpdateCheckInfoForStripe';
import { UserEntity } from './user.entity';
import { User } from './user';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @Inject(forwardRef(() => VinylService))
    private vinylsService: VinylService,
    private reviewService: ReviewService,
  ) {}

  async getUsers(): Promise<UserEntity[]> {
    return await this.usersRepository.find();
  }

  async createUser(payload: UserCreatePayloadDto): Promise<UserEntity> {
    const user: User = new User(payload);
    const newUserEntity: UserEntity = this.usersRepository.create({
      ...user,
    });
    await this.usersRepository.save(newUserEntity);

    return newUserEntity;
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    return await this.usersRepository.findOne({
      email: email,
    });
  }

  async getProfile(id: number): Promise<IProfileOutput> {
    const findUser: UserEntity = await this.usersRepository.findOne({ id: id });
    if (!findUser) {
      throw new NotFoundException();
    }
    const userVinyls: VinylEntity[] =
      await this.vinylsService.getVinylsByUserId(findUser.id);
    const userReviews: ReviewEntity[] =
      await this.reviewService.getReviewsByUserId(id);
    const allReviews: ReviewEntity[] = await this.reviewService.getReviews();
    const payload: IUserEntityWithReviewsAndVinylsToUser = {
      user: findUser,
      vinyls: userVinyls,
      userReviews: userReviews,
      allReviews: allReviews,
    };
    return userEntityToUser(payload);
  }

  async getUserById(id: number): Promise<UserEntity> {
    const findUser: UserEntity = await this.usersRepository.findOne({ id: id });
    if (!findUser) {
      throw new NotFoundException();
    }
    return findUser;
  }

  async patchUserProfileById(
    payload: IProfileUpdateWithIdPayload,
  ): Promise<IProfileOutput> {
    try {
      await this.getUserById(payload.id);
      if (payload.firstName) {
        await this.usersRepository.update(payload.id, {
          firstName: payload.firstName,
        });
      }
      if (payload.lastName) {
        await this.usersRepository.update(payload.id, {
          lastName: payload.lastName,
        });
      }
      if (payload.birthDate) {
        await this.usersRepository.update(payload.id, {
          birthDate: payload.birthDate,
        });
      }
      if (payload.avatar) {
        await this.usersRepository.update(payload.id, {
          avatar: payload.avatar,
        });
      }
      return this.getProfile(payload.id);
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async updateCheck(payload: IUpdateCheckInfoForStripe): Promise<void> {
    await this.usersRepository.update(payload.userId, {
      checkPayment: payload.checkPayment,
      checkVinylId: payload.checkVinylId,
    });
  }
}
