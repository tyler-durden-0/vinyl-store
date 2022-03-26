import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Max, Min } from 'class-validator';

export class ReviewPayloadDto {
  @ApiProperty({ type: String, description: 'comment' })
  @IsNotEmpty()
  comment: string;

  @ApiProperty({ type: Number, description: 'score', minimum: 1, maximum: 5 })
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  score: number;
}
