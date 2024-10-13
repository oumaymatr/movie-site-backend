import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './movie/movie.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    MoviesModule,
    BookmarkModule,
    AuthModule,
    AdminModule,
    MulterModule.register({
      dest: './uploads', // Set your upload directory
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
