import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserCreatePayloadDto } from '../user/dto/UserCreatePayloadDto';
import { LoginPayloadDto } from './dto/LoginPayloadDto';
import { UserEntity } from '../user/user.entity';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Authorization')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @ApiCreatedResponse({ description: 'User Registration' })
  @ApiBadRequestResponse({ description: 'Invalid data request' })
  @ApiBody({ type: UserCreatePayloadDto })
  register(@Body() payload: UserCreatePayloadDto): Promise<UserEntity> {
    return this.authService.register(payload);
  }

  @Post('/login')
  @ApiCreatedResponse({
    description: 'User Login(create and return access_token)',
  })
  @ApiBadRequestResponse({ description: 'Check email or pass' })
  login(@Body() payload: LoginPayloadDto) {
    return this.authService.login(payload);
  }
}
