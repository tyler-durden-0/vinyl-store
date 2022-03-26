import { Review } from '../../review/review';

export interface IVinylOutput {
  price: number;
  name: string;
  authorName: string;
  description: string;
  reviews: Review[];
}
