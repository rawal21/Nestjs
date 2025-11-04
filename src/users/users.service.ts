import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(name: string, email: string, password: string) {
    const hashPassword = await bcrypt.hash(password, 10);

    return await this.userModel.create({
      name,
      email,
      password: hashPassword,
    });
  }

  async getUserByEmail(email: string) {
    return this.userModel.findOne({ email });
  }
}
