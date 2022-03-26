import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { Reflector } from '@nestjs/core';
import { USER_ROLES } from './roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    @Inject(UserService) private userService: UserService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<USER_ROLES[]>(
      'roles',
      context.getHandler(),
    );

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    if (!request.user) {
      throw new UnauthorizedException();
    }

    const user: UserEntity = await this.userService.getUserById(
      request.user.id,
    );

    return (
      (user.isAdmin && roles.includes(USER_ROLES.ADMIN)) ||
      (!user.isAdmin && roles.includes(USER_ROLES.USER))
    );
  }
}
