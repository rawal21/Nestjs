import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(name: string, email: string, password: string) {
    const userExist = await this.userService.getUserByEmail(email);
    if (userExist) throw new UnauthorizedException('Email is already exisit');

    return this.userService.createUser(name, email, password);
  }

  async login(email: string, password: string) {
    const user = await this.userService.getUserByEmail(email);
    if (!user) throw new UnauthorizedException('user not found ');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid password ');
    }

    const payload = { id: user._id, email: user.email };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
