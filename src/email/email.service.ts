import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private nodemailerTransport: nodemailer.Transporter;
  private logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    this.nodemailerTransport = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASSWORD'),
      },
    });
  }

  async sendResetPasswordLink(email: string, token: string): Promise<void> {
    const resetUrl = `${this.configService.get('EMAIL_RESET_PASSWORD_URL')}?token=${token}`;
    const mailOptions = {
      from: this.configService.get('EMAIL_USER'),
      to: email,
      subject: 'Password Reset',
      text: `To reset your password, click the following link: ${resetUrl}`,
    };

    this.logger.log(`Sending password reset email to: ${email}`);
    await this.nodemailerTransport.sendMail(mailOptions);
  }
}
