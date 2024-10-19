import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  Logger,
  HttpException,
  HttpStatus,
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
}
