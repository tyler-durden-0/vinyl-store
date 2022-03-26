import { VinylCreatePayloadDto } from './dto/VinylCreatePayload.dto';
import { Review } from '../review/review';

export class Vinyl {
  private price: number;
  private name: string;
  private authorName: string;
  private description: string;
  private image: string;
  private readonly reviews: Review[];

  constructor(payload: VinylCreatePayloadDto) {
    this.price = payload.price;
    this.name = payload.name;
    this.authorName = payload.authorName;
    this.description = payload.description;
    this.image = payload.image;
    this.reviews = payload.reviews;
  }

  getName(): string {
    return this.name;
  }

  setName(name: string): void {
    this.name = name;
  }

  getAuthorName(): string {
    return this.authorName;
  }

  setAuthorName(authorName: string): void {
    this.authorName = authorName;
  }

  getDescription(): string {
    return this.description;
  }

  setDescription(description: string): void {
    this.description = description;
  }

  getImage(): string {
    return this.image;
  }

  setImage(image: string): void {
    this.image = image;
  }

  getPrice(): number {
    return this.price;
  }

  setPrice(price: number): void {
    this.price = price;
  }

  getReviews(): Review[] {
    return this.reviews;
  }

  addReview(review: Review): void {
    this.reviews.push(review);
  }
}
