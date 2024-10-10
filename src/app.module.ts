import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './user/user.module';
import { MoviesModule } from './movie/movie.module';
import { BookmarkModule } from './bookmark/bookmark.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/movies_db'),
    UsersModule,
    MoviesModule,
    BookmarkModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
