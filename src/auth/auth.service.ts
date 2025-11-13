import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
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
    if (userExist) throw new BadRequestException('Email already exists');

    return this.userService.createUser(name, email, password);
  }

  async login(email: string, password: string) {
    const user = await this.userService.getUserByEmail(email);
    if (!user) throw new UnauthorizedException('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    console.log("user in login debug" , user);

    // ✅ Fix: use `userId` instead of `id`
    const payload = { userId: user._id, email: user.email };
    console.log(" payload ",payload)

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getProfile(userId: string) {
    // ✅ Ensure password isn’t exposed
    console.log('userId is debuging..', userId);
    const user = await this.userService.getUserById(userId);
    if (!user) throw new UnauthorizedException('User not found');

    const { password, ...safeUser } = user.toObject ? user.toObject() : user;
    return safeUser;
  }
}
