import { Body, Controller, Post, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateSignUpDto } from './dto/signup/signup.dto';
import { CreateLoginDto } from './dto/login/login.dto';
import { JwtAuthGuard } from './jwt/jwt.guard';
import { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

interface AuthenticatedRequest extends Request {
  user: { userId: string; email: string };
}

@ApiTags('bauth') // Groups all endpoints under "auth" in Swagger
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // ---------------- SIGNUP ----------------
  @Post('signup')
  @ApiOperation({ summary: 'User signup' })
  @ApiBody({
    description: 'User registration details',
    type: CreateSignUpDto,
    examples: {
      default: {
        summary: 'Example signup body',
        value: {
          name: 'John Doe',
          email: 'john@gmail.com',
          password: '123456',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request — missing fields or invalid data',
  })
  signup(@Body() body: CreateSignUpDto) {
    return this.authService.signup(body.name, body.email, body.password);
  }

  // ---------------- LOGIN ----------------
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({
    description: 'User login credentials',
    type: CreateLoginDto,
    examples: {
      default: {
        summary: 'Example login body',
        value: {
          email: 'john@gmail.com',
          password: '123456',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully — returns JWT token',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized — invalid credentials',
  })
  login(@Body() body: CreateLoginDto) {
    return this.authService.login(body.email, body.password);
  }

  // ---------------- PROFILE ----------------
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth() // Adds lock icon for JWT token input
  @ApiOperation({ summary: 'Get user profile (requires JWT)' })
  @ApiResponse({
    status: 200,
    description: 'Returns the logged-in user profile',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized — missing or invalid JWT token',
  })
  profile(@Req() req: AuthenticatedRequest) {
    console.log('req.user debugging', req.user);
    return this.authService.getProfile(req.user.userId);
  }
}
