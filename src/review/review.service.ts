import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewEntity } from './review.entity';
import { Repository } from 'typeorm';
import { IReviewCreatePayload } from './interfaces/IReviewCreatePayload';
import { Review } from './review';
import { IConnectReviewFromUserToVinyl } from './interfaces/IConnectReviewFromUserToVinyl';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(ReviewEntity)
    private reviewRepository: Repository<ReviewEntity>,
  ) {}

  async createReview(payload: IReviewCreatePayload): Promise<ReviewEntity> {
    try {
      const review = new Review(payload);
      const newReviewEntity: ReviewEntity = await this.reviewRepository.create({
        ...review,
      });
      await this.reviewRepository.save(newReviewEntity);
      return newReviewEntity;
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async connectReviewFromUserToVinyl(
    payload: IConnectReviewFromUserToVinyl,
  ): Promise<void> {
    try {
      const { review, user, vinyl } = { ...payload };
      review.user = user;
      review.vinyl = vinyl;
      await this.reviewRepository.save(review);
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async getReviewsByUserId(id: number): Promise<ReviewEntity[]> {
    const userReviews: ReviewEntity[] = await this.reviewRepository.find({
      relations: ['user'],
    });
    if (!userReviews) {
      throw new NotFoundException();
    }
    return userReviews.filter((review: ReviewEntity) => review.user.id === id);
  }

  async getReviewsByVinylId(id: number): Promise<ReviewEntity[]> {
    const userReviews: ReviewEntity[] = await this.reviewRepository.find({
      relations: ['vinyl'],
    });
    if (!userReviews) {
      throw new NotFoundException();
    }
    return userReviews.filter((review: ReviewEntity) => review.vinyl.id === id);
  }

  async getReviews(): Promise<ReviewEntity[]> {
    const userReviews: ReviewEntity[] = await this.reviewRepository.find({
      relations: ['vinyl'],
    });
    if (!userReviews) {
      throw new NotFoundException();
    }
    return userReviews;
  }
}
