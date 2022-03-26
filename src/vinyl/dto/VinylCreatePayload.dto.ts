import { Review } from '../../review/review';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class VinylCreatePayloadDto {
  @ApiProperty({ type: Number, description: 'price' })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  price: number;

  @ApiProperty({ type: String, description: 'name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ type: String, description: 'authorName' })
  @IsNotEmpty()
  @IsString()
  authorName: string;

  @ApiProperty({ type: String, description: 'description' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ type: String, description: 'image' })
  @IsNotEmpty()
  @IsString()
  image: string;

  @ApiProperty({ type: [Review], description: 'reviews', required: false })
  @IsOptional()
  reviews: Review[];
}
