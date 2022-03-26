import {
  Body,
  Controller,
  Get,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ProfileUpdatePayloadDto } from './dto/ProfileUpdatePayloadDto';
import { IProfileOutput } from '../mappers/interfaces/IProfileOutput';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../vinyl/roles.decorator';
import { USER_ROLES } from '../vinyl/roles.enum';
import { RolesGuard } from '../vinyl/roles.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('User Profile')
@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/profile')
  @Roles(USER_ROLES.USER, USER_ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiUnauthorizedResponse({ description: 'Unauthorized, please login' })
  @ApiOkResponse({ description: 'Get user profile' })
  getProfile(@Request() req): Promise<IProfileOutput> {
    return this.userService.getProfile(Number(req.user.id));
  }

  @Patch('/profile/edit')
  @Roles(USER_ROLES.USER, USER_ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiUnauthorizedResponse({ description: 'Unauthorized, please login' })
  @ApiOkResponse({ description: 'Get user profile after updating' })
  @ApiBadRequestResponse({ description: 'Invalid data request' })
  @ApiBody({ type: ProfileUpdatePayloadDto })
  async patchUserProfileById(
    @Request() req,
    @Body() payload: ProfileUpdatePayloadDto,
  ): Promise<IProfileOutput> {
    return this.userService.patchUserProfileById({
      ...payload,
      id: Number(req.user.id),
    });
  }
}
