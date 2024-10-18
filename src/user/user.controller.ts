import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Param,
  Put,
  Delete,
  UseInterceptors,
  UploadedFile,
  Res,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { Types } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport'; // or your custom guard

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    console.log('Received signup request:', createUserDto);
    createUserDto.setDefaultProfilePicture();
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Put(':id/username')
  async updateUsername(
    @Param('id') id: string,
    @Body('nom_d_utilisateur') nom_d_utilisateur: string,
  ): Promise<User> {
    return this.userService.update(id, { nom_d_utilisateur });
  }

  @Put(':id/email')
  async updateEmail(
    @Param('id') id: string,
    @Body('email') email: string,
  ): Promise<User> {
    return this.userService.update(id, { email });
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    // Here, handle the file saving logic and return the path or response
    // For example:
    const filePath = `path/to/save/${file.filename}`; // Define your path logic
    return res
      .status(HttpStatus.OK)
      .json({ message: 'Upload successful', path: filePath });
  }

  @Put(':id/password')
  async updatePassword(
    @Param('id') id: string,
    @Body('mot_de_passe') mot_de_passe: string,
  ): Promise<User> {
    return this.userService.update(id, { mot_de_passe });
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<User> {
    return this.userService.remove(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('bookmark')
  async bookmarkMovie(@Req() req, @Body('movieId') movieId: string) {
    const userId = req.user.userId;

    // Check if the ID is a valid ObjectId
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID format');
    }

    // Convert ObjectId to string before passing
    return this.userService.addBookmark(userId.toString(), movieId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('bookmark')
  async getUserBookmarks(@Req() req): Promise<any[]> {
    const userId = req.user.userId;

    // Valide l'ObjectId
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID format');
    }

    // Récupère les favoris de l'utilisateur
    return this.userService.getUserBookmarks(userId.toString());
  }
  @UseGuards(AuthGuard('jwt'))
  @Delete('bookmark/:movieId')
  async removeBookmark(@Req() req, @Param('movieId') movieId: string) {
    const userId = req.user.userId;

    // Check if the ID is a valid ObjectId
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID format');
    }

    // Remove the bookmark
    return this.userService.removeBookmark(userId.toString(), movieId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }
  @Post(':id/upload-photo')
  @UseInterceptors(FileInterceptor('photo'))
  async uploadPhoto(
    @Param('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const photoUrl = await this.userService.updateProfilePicture(userId, file);
    return { photoUrl }; // Send the new photo URL back in the response
  }
  @UseGuards(AuthGuard('jwt'))
  @Get(':id/profile-picture')
  async getUserById(@Param('id') id: string) {
    // Use @Req() instead of @Request()
    const user = await this.userService.findOne(id); // Fetch user by ID
    if (user) {
      return {
        photo_de_profil: user.photo_de_profil, // Return only the profile picture
      };
    }
    return { message: 'User not found' }; // Handle case where user is not found
  }
}
