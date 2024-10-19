import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  Logger,
  HttpException,
  HttpStatus,
  Get,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    this.logger.debug('Login attempt');
    try {
      const result = await this.authService.login(req.user);
      this.logger.debug('Login successful');
      return result;
    } catch (error) {
      this.logger.error(`Login failed: ${error.message}`);
      // Here we can differentiate between user not found and incorrect password
      if (error instanceof HttpException) {
        throw error; // Propagate the HTTP exception to send the proper status code and message
      } else {
        throw new HttpException(
          'An unexpected error occurred',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    this.logger.debug('Signup attempt');
    try {
      const result = await this.authService.signup(createUserDto);
      this.logger.debug('Signup successful');
      return result;
    } catch (error) {
      this.logger.error(`Signup failed: ${error.message}`);
      throw new HttpException('Signup failed', HttpStatus.BAD_REQUEST);
    }
  }
  @Post('forgot-password')
  async forgotPassword(@Body() { email }: { email: string }): Promise<void> {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  async resetPassword(
    @Body() body: { token: string; newPassword: string },
  ): Promise<void> {
    return this.authService.resetPassword(body.token, body.newPassword);
  }
  @Get('reset-password')
  async verifyResetToken(@Query('token') token: string) {
    try {
      // Await the token verification to resolve the promise
      console.log('i am here');
      this.logger.log('fucking here');
      const decoded = await this.authService.verifyResetToken(token);
      // If the token is valid, return a response
      this.logger.log(decoded);
      return {
        message: 'Token is valid. You can proceed to reset your password.',
        email: decoded.email, // Now you can access email
      };
    } catch (error) {
      this.logger.error(`Invalid token: ${error.message}`);
      throw new HttpException(
        'Invalid or expired token',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
