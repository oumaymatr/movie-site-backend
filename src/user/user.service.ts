import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email }).exec();
  }

  async remove(id: string): Promise<User> {
    return this.userModel.findByIdAndDelete(id).exec(); // Utiliser findByIdAndDelete ici
  }

  // Inside the UserService
  async update(
    id: string,
    updateUserDto: Partial<CreateUserDto>,
  ): Promise<User> {
    // Hash the password if it is being updated
    if (updateUserDto.mot_de_passe) {
      updateUserDto.mot_de_passe = await bcrypt.hash(
        updateUserDto.mot_de_passe,
        10,
      );
    }
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async addBookmark(userId: string, movieId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Add the movieId to the bookmarks array if it's not already bookmarked
    if (!user.bookmarks.includes(movieId)) {
      user.bookmarks.push(movieId);
      await user.save();
    }
    return user;
  }

  async getUserBookmarks(userId: string): Promise<string[]> {
    const user = await this.userModel.findById(userId).select('bookmarks');
    return user.bookmarks;
  }

  async removeBookmark(userId: string, movieId: string): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $pull: { bookmarks: movieId } }, // Assuming 'bookmarks' is an array field in the user model
      { new: true }, // Return the updated document
    );
  }
}
