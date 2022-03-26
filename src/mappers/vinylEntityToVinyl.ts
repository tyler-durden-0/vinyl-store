import { IVinylOutput } from './interfaces/IVinylOutput';
import { ReviewEntity } from '../review/review.entity';
import { Review } from '../review/review';
import { IReviewCreatePayload } from '../review/interfaces/IReviewCreatePayload';
import { IVinylsOutput } from './interfaces/IVinylsOutput';

export const vinylEntityToVinyl = (payload: IVinylsOutput): IVinylOutput => {
  const arr: ReviewEntity[] = payload.reviews.filter(
    (review: ReviewEntity) => review.vinyl.id === payload.vinyl.id,
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
  return {
    price: payload.vinyl.price,
    name: payload.vinyl.name,
    authorName: payload.vinyl.authorName,
    description: payload.vinyl.description,
    reviews: resultReview,
  };
};
