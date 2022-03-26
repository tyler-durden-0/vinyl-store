import { UserCreatePayloadDto } from './dto/UserCreatePayloadDto';
import { Review } from '../review/review';
import { Vinyl } from '../vinyl/vinyl';

export class User {
  private email: string;
  private password: string;
  private firstName: string;
  private lastName: string;
  private birthDate: string;
  private avatar: string;
  private readonly isAdmin: boolean;
  private readonly reviews: Review[];
  private readonly boughtVinylRecords: Vinyl[];

  constructor(payload: UserCreatePayloadDto) {
    this.email = payload.email;
    this.password = payload.password;
    this.firstName = payload.firstName;
    this.lastName = payload.lastName;
    this.birthDate = payload.birthDate;
    this.avatar = payload.avatar;
    this.isAdmin = payload.isAdmin;
    this.reviews = [];
    this.boughtVinylRecords = [];
  }

  getEmail(): string {
    return this.email;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  getPassword(): string {
    return this.password;
  }

  setPassword(password: string): void {
    this.password = password;
  }

  getFirstName(): string {
    return this.firstName;
  }

  setFirstName(firstName: string): void {
    this.firstName = firstName;
  }

  getLastName(): string {
    return this.lastName;
  }

  setLastName(lastName: string): void {
    this.lastName = lastName;
  }

  getBirthDate(): string {
    return this.birthDate;
  }

  setBirthDate(birthDate: string): void {
    this.birthDate = birthDate;
  }

  getAvatar(): string {
    return this.avatar;
  }

  setAvatar(avatar: string): void {
    this.avatar = avatar;
  }

  getReviews(): Review[] {
    return this.reviews;
  }

  addReview(review: Review): void {
    this.reviews.push(review);
  }

  getBoughtVinylRecords(): Vinyl[] {
    return this.boughtVinylRecords;
  }

  addBoughtVinyl(vinyl: Vinyl): void {
    this.boughtVinylRecords.push(vinyl);
  }

  getIsAdmin(): boolean {
    return this.isAdmin;
  }
}
