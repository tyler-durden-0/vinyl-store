import { UserEntity } from '../../user/user.entity';
import { VinylEntity } from '../../vinyl/vinyl.entity';
import { ReviewEntity } from '../../review/review.entity';

export interface IUserEntityWithReviewsAndVinylsToUser {
  user: UserEntity;
  vinyls: VinylEntity[];
  userReviews: ReviewEntity[];
  allReviews: ReviewEntity[];
}
