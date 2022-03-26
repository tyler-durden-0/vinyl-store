import { Review } from '../../review/review';
import { Vinyl } from '../../vinyl/vinyl';

export interface IProfileOutput {
  firstName: string;
  lastName: string;
  birthDate: string;
  avatar: string;
  reviews: Review[];
  vinyls: Vinyl[];
}
