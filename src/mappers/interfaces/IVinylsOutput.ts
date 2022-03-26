import { VinylEntity } from '../../vinyl/vinyl.entity';
import { ReviewEntity } from '../../review/review.entity';

export interface IVinylsOutput {
  vinyls: VinylEntity[];
  reviews: ReviewEntity[];
  vinyl?: VinylEntity;
}
