import { IUserEntityWithReviewsAndVinylsToUser } from './interfaces/IUserEntityWithReviewsAndVinylsToUser';
import { User } from '../user/user';
import { UserCreatePayloadDto } from '../user/dto/UserCreatePayloadDto';
import { VinylCreatePayloadDto } from '../vinyl/dto/VinylCreatePayload.dto';
import { Vinyl } from '../vinyl/vinyl';
import { IProfileOutput } from './interfaces/IProfileOutput';
import { IReviewCreatePayload } from '../review/interfaces/IReviewCreatePayload';
import { Review } from '../review/review';
import { ReviewEntity } from '../review/review.entity';

export const userEntityToUser = (
  payload: IUserEntityWithReviewsAndVinylsToUser,
): IProfileOutput => {
  const payloadForUser: UserCreatePayloadDto = {
    email: payload.user.email,
    password: payload.user.password,
    firstName: payload.user.firstName,
    lastName: payload.user.lastName,
    birthDate: payload.user.birthDate,
    avatar: payload.user.avatar,
    isAdmin: payload.user.isAdmin,
  };

  const resultUser = new User(payloadForUser);
  const vinylsCount = payload.vinyls.length;
  let payloadForVinyl: VinylCreatePayloadDto;

  //prepare show vinyls
  for (let i = 0; i < vinylsCount; i++) {
    const arr: ReviewEntity[] = payload.allReviews.filter(
      (review: ReviewEntity) => {
        if (review.vinyl) {
          if (review.vinyl.id === payload.vinyls[i].id) {
            return true;
          }
        }
      },
    );
    const reviewsCount: number = arr.length;
    const resultReview: Review[] = [];
    let payloadForReview: IReviewCreatePayload;
    for (let j = 0; j < reviewsCount; j++) {
      payloadForReview = {
        comment: arr[j].comment,
        score: Number(arr[j].score),
        authorName: arr[j].authorName,
      };
      const review: Review = new Review(payloadForReview);
      resultReview.push(review);
    }

    if (payload.vinyls) {
      payloadForVinyl = {
        price: payload.vinyls[i].price,
        name: payload.vinyls[i].name,
        authorName: payload.vinyls[i].authorName,
        description: payload.vinyls[i].description,
        image: payload.vinyls[i].image,
        reviews: resultReview,
      };
      const vinyl: Vinyl = new Vinyl(payloadForVinyl);

      resultUser.addBoughtVinyl(vinyl);
    }
  }

  const userReviewCount = payload.userReviews.length;
  let payloadForReview: IReviewCreatePayload;

  for (let i = 0; i < userReviewCount; i++) {
    payloadForReview = {
      comment: payload.userReviews[i].comment,
      score: payload.userReviews[i].score,
      authorName: payload.userReviews[i].authorName,
    };
    const userReview: Review = new Review(payloadForReview);
    resultUser.addReview(userReview);
  }

  return {
    firstName: resultUser.getFirstName(),
    lastName: resultUser.getLastName(),
    birthDate: resultUser.getBirthDate(),
    avatar: resultUser.getAvatar(),
    reviews: resultUser.getReviews(),
    vinyls: resultUser.getBoughtVinylRecords(),
  };
};
