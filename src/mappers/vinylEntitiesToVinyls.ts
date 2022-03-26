import { IVinylOutput } from './interfaces/IVinylOutput';
import { IVinylsOutput } from './interfaces/IVinylsOutput';
import { ReviewEntity } from '../review/review.entity';
import { IReviewCreatePayload } from '../review/interfaces/IReviewCreatePayload';
import { Review } from '../review/review';

export const vinylEntitiesToVinyls = (
  payload: IVinylsOutput,
): IVinylOutput[] => {
  if (payload.vinyls.length > 0) {
    const vinylsCount = payload.vinyls.length;
    const resultVinyls: IVinylOutput[] = [];
    let outputVinyl: IVinylOutput;
    for (let i = 0; i < vinylsCount; i++) {
      const arr: ReviewEntity[] = payload.reviews.filter(
        (review: ReviewEntity) => review.vinyl.id === payload.vinyls[i].id,
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
      outputVinyl = {
        price: payload.vinyls[i].price,
        name: payload.vinyls[i].name,
        authorName: payload.vinyls[i].authorName,
        description: payload.vinyls[i].description,
        reviews: resultReview,
      };
      resultVinyls.push(outputVinyl);
    }
    return resultVinyls;
  }
};
