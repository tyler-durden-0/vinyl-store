import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ProfileUpdatePayloadDto {
  @ApiProperty({ type: String, description: 'firstName', required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  firstName?: string;

  @ApiProperty({ type: String, description: 'lastName', required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  lastName?: string;

  @ApiProperty({ type: String, description: 'birthDate', required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  birthDate?: string;

  @ApiProperty({ type: String, description: 'avatar', required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  avatar?: string;
}
