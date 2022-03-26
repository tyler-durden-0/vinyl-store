import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { IRegisteredByGoogle } from './auth/interfaces/IRegisteredByGoogle';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Authorization with Google')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('auth/google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req): Promise<IRegisteredByGoogle> {
    return this.authService.googleLogin(req);
  }
}
