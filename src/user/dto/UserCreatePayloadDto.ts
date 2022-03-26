import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserCreatePayloadDto {
  @ApiProperty({ type: String, description: 'email' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, description: 'password' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ type: String, description: 'firstName' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ type: String, description: 'lastName' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ type: String, description: 'birthDate' })
  @IsNotEmpty()
  @IsString()
  birthDate: string;

  @ApiProperty({ type: String, description: 'avatar' })
  @IsNotEmpty()
  @IsString()
  avatar: string;

  @ApiProperty({ type: Boolean, description: 'isAdmin', default: false })
  @IsNotEmpty()
  @IsBoolean()
  isAdmin: boolean;
}
