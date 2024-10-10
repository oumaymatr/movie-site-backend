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
