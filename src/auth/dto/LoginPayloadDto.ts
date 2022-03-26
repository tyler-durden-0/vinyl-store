import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginPayloadDto {
  @ApiProperty({ type: String, description: 'email' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, description: 'pass' })
  @IsNotEmpty()
  @IsString()
  pass: string;
}
