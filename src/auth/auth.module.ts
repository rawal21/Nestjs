import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule, // ✅ imports UsersService + UserModel
    JwtModule.register({
      secret: 'whywouldishare',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, JwtStrategy], // ✅ REMOVE UsersService
  controllers: [AuthController],
})
export class AuthModule {}
