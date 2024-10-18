import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

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

  async updateProfilePicture(
    userId: string,
    file: Express.Multer.File,
  ): Promise<string> {
    // Ensure the uploads directory exists (outside the dist folder)
    const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Sanitize the filename (removes special characters and replaces them with underscores)
    const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uploadPath = path.join(uploadsDir, sanitizedFilename);

    // Save the file to the uploads directory
    fs.writeFileSync(uploadPath, file.buffer);

    // Store the relative file path in the database (e.g., 'uploads/filename.jpg')
    const photoUrl = `/uploads/${sanitizedFilename}`;
    await this.userModel.updateOne(
      { _id: userId },
      { photo_de_profil: photoUrl },
    );

    return photoUrl; // Return the file URL for further use
  }
}
