import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bookmark } from './schemas/bookmark.schema';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectModel(Bookmark.name) private bookmarkModel: Model<Bookmark>,
  ) {}

  async create(createBookmarkDto: CreateBookmarkDto): Promise<Bookmark> {
    const newBookmark = new this.bookmarkModel(createBookmarkDto);
    return newBookmark.save();
  }

  async findAll(): Promise<Bookmark[]> {
    return this.bookmarkModel.find().exec();
  }

  async findOne(id: string): Promise<Bookmark> {
    return this.bookmarkModel.findById(id).exec();
  }

  async findByUserId(userId: string): Promise<Bookmark[]> {
    return this.bookmarkModel.find({ userId }).exec();
  }

  async findByMovieId(movieId: string): Promise<Bookmark[]> {
    return this.bookmarkModel.find({ movieId }).exec();
  }

  async findByUserIdAndMovieId(
    userId: string,
    movieId: string,
  ): Promise<Bookmark> {
    return this.bookmarkModel.findOne({ userId, movieId }).exec();
  }

  async remove(id: string): Promise<Bookmark> {
    return this.bookmarkModel.findByIdAndDelete(id).exec();
  }
}
