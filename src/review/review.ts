import { IReviewCreatePayload } from './interfaces/IReviewCreatePayload';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Max, Min } from 'class-validator';

export class Review {
  @ApiProperty({ type: String, description: 'comment' })
  @IsNotEmpty()
  private comment: string;

  @ApiProperty({ type: Number, description: 'score', minimum: 1, maximum: 5 })
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  private score: number;

  @ApiProperty({ type: String, description: 'authorName' })
  @IsNotEmpty()
  private authorName: string;

  constructor(payload: IReviewCreatePayload) {
    this.comment = payload.comment;
    this.score = payload.score;
    this.authorName = payload.authorName;
  }

  getComment(): string {
    return this.comment;
  }

  setComment(comment: string): void {
    this.comment = comment;
  }

  getScore(): number {
    return this.score;
  }

  setScore(score: number): void {
    this.score = score;
  }

  getAuthorName(): string {
    return this.authorName;
  }

  setAuthorName(authorName: string): void {
    this.authorName = authorName;
  }
}
