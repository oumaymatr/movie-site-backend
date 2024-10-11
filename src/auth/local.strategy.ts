import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'mot_de_passe',
    });
  }

  async validate(email: string, mot_de_passe: string): Promise<any> {
    this.logger.debug(`Attempting to validate user: ${email}`);
    const user = await this.authService.validateUser(email, mot_de_passe);
    if (!user) {
      this.logger.error(`User validation failed for email: ${email}`);
      throw new UnauthorizedException();
    }
    this.logger.debug(`User validated successfully: ${email}`);
    return user;
  }
}
