import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email.service';

@Module({
  imports: [ConfigModule], // Import ConfigModule to access environment variables
  providers: [EmailService],
  exports: [EmailService], // Export the EmailService so it can be used in other modules
})
export class EmailModule {}
