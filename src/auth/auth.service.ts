import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    this.logger.debug(`Validating user: ${email}`);
    const user = await this.userService.findByEmail(email);
    if (!user) {
      this.logger.debug(`User not found: ${email}`);
      return null;
    }
    const isPasswordValid = await bcrypt.compare(pass, user.mot_de_passe);
    if (isPasswordValid) {
      this.logger.debug(`Password valid for user: ${email}`);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { mot_de_passe, ...result } = user.toObject();
      return result;
    }
    this.logger.debug(`Password invalid for user: ${email}`);
    return null;
  }

  async login(user: any) {
    this.logger.debug(`Generating JWT for user: ${user.email}`);
    const payload = { email: user.email, sub: user._id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(createUserDto: CreateUserDto) {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.userService.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(createUserDto.mot_de_passe, 10);

    // Créer le nouvel utilisateur
    const newUser = await this.userService.create({
      ...createUserDto,
      mot_de_passe: hashedPassword,
    });

    // Retourner l'utilisateur sans le mot de passe
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { mot_de_passe, ...result } = newUser.toObject();
    return result;
  }
}
