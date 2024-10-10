import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { Bookmark } from './schemas/bookmark.schema';

@Controller('bookmark')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Get()
  async findAll(): Promise<Bookmark[]> {
    return this.bookmarkService.findAll();
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string): Promise<Bookmark[]> {
    return this.bookmarkService.findByUserId(userId);
  }

  @Get('movie/:movieId')
  async findByMovieId(@Param('movieId') movieId: string): Promise<Bookmark[]> {
    return this.bookmarkService.findByMovieId(movieId);
  }

  @Get('user/:userId/movie/:movieId')
  async findByUserIdAndMovieId(
    @Param('userId') userId: string,
    @Param('movieId') movieId: string,
  ): Promise<Bookmark> {
    return this.bookmarkService.findByUserIdAndMovieId(userId, movieId);
  }

  @Post()
  async create(
    @Body() createBookmarkDto: CreateBookmarkDto,
  ): Promise<Bookmark> {
    return this.bookmarkService.create(createBookmarkDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Bookmark> {
    return this.bookmarkService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Bookmark> {
    return this.bookmarkService.remove(id);
  }
}
