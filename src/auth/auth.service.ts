import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    this.logger.debug(`Validating user: ${email}`);
    const user = await this.userService.findByEmail(email);
    if (!user) {
      this.logger.debug(`User not found: ${email}`);
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND); // Use specific HTTP exception
    }
    const isPasswordValid = await bcrypt.compare(pass, user.mot_de_passe);
    if (isPasswordValid) {
      this.logger.debug(`Password valid for user: ${email}`);
      const { mot_de_passe, ...result } = user.toObject();
      return result;
    }
    this.logger.debug(`Password invalid for user: ${email}`);
    throw new HttpException('Incorrect password', HttpStatus.UNAUTHORIZED); // Use specific HTTP exception
  }
  async login(user: any) {
    this.logger.debug(`Generating JWT for user: ${user.email}`);
    const payload = { email: user.email, sub: user._id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(createUserDto: CreateUserDto) {
    // Check if the user already exists
    const existingUser = await this.userService.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(createUserDto.mot_de_passe, 10);

    // Create a new instance of CreateUserDto
    const newUserDto = new CreateUserDto();

    // Populate it with the incoming data
    newUserDto.nom_d_utilisateur = createUserDto.nom_d_utilisateur;
    newUserDto.email = createUserDto.email;
    newUserDto.mot_de_passe = hashedPassword; // Don't forget to set the hashed password
    newUserDto.role = createUserDto.role;
    newUserDto.bookmarks = createUserDto.bookmarks;

    // Set the default profile picture
    newUserDto.setDefaultProfilePicture();

    // Create the new user
    const newUser = await this.userService.create(newUserDto);

    // Return the user without the password
    const { mot_de_passe, ...result } = newUser.toObject();
    return result;
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }
    // Generate token
    const token = this.jwtService.sign(
      { email: user.email },
      { expiresIn: '1h' },
    );
    // Send email with reset link
    await this.emailService.sendResetPasswordLink(user.email, token);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    // Decode and verify token
    const decoded = this.jwtService.verify(token);
    const user = await this.userService.findByEmail(decoded.email);
    if (!user) {
      throw new NotFoundException(`No user found for email: ${decoded.email}`);
    }

    // Hash new password and save
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.mot_de_passe = hashedPassword;
    await user.save();
  }

  async verifyResetToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token); // Verify the token
      return decoded; // Return the decoded payload if valid
    } catch (error) {
      throw new HttpException(
        'Invalid or expired token',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
