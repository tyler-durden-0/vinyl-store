import { ReviewEntity } from '../review.entity';
import { UserEntity } from '../../user/user.entity';
import { VinylEntity } from '../../vinyl/vinyl.entity';

export interface IConnectReviewFromUserToVinyl {
  review: ReviewEntity;
  user: UserEntity;
  vinyl: VinylEntity;
}
