import { BadRequestException, Injectable } from '@nestjs/common';
import { UserCreatePayloadDto } from '../user/dto/UserCreatePayloadDto';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { IRegisteredByGoogle } from './interfaces/IRegisteredByGoogle';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(payload: UserCreatePayloadDto): Promise<UserEntity> {
    const candidate: UserEntity = await this.userService.findUserByEmail(
      payload.email,
    );
    if (!candidate) {
      const hashPassword: string = await bcrypt.hash(payload.password, 5);
      return await this.userService.createUser({
        ...payload,
        password: hashPassword,
      });
    }
    throw new BadRequestException();
  }

  async isUser(email: string, pass: string): Promise<boolean> {
    const user: UserEntity = await this.userService.findUserByEmail(email);
    const passwordEquals = await bcrypt.compare(pass, user.password);
    return !!(user && passwordEquals);
  }

  async login(user: any): Promise<any> {
    if (user.email) {
      const userEntity: UserEntity = await this.userService.findUserByEmail(
        user.email,
      );
      if (await this.isUser(user.email, user.pass)) {
        const payload = { id: userEntity.id };
        return {
          access_token: this.jwtService.sign(payload),
        };
      }
      throw new BadRequestException();
    }
  }

  async loginByGoogle(user: any): Promise<any> {
    if (user.email) {
      const userEntity: UserEntity = await this.userService.findUserByEmail(
        user.email,
      );
      if (userEntity) {
        const payload = { id: userEntity.id };
        return {
          access_token: this.jwtService.sign(payload),
        };
      }
      throw new BadRequestException();
    }
  }

  async googleLogin(req): Promise<IRegisteredByGoogle> {
    if (!req.user) {
      return { message: 'No user from google' };
    }

    const candidate = {
      email: req.user.email,
    };

    return await this.loginByGoogle(candidate);
  }
}
