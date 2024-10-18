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
import { diskStorage } from 'multer';
import { Types } from 'mongoose';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport'; // or your custom guard

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put(':id/profile-picture')
  @UseInterceptors(
    FileInterceptor('photo_de_profil', {
      storage: diskStorage({
        destination: './uploads', // Folder where files will be saved
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname)); // Store files with unique names
        },
      }),
    }),
  )
  async updateProfilePicture(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File, // Get the uploaded file
  ): Promise<User> {
    const photoDeProfil = file.path; // Save the file path
    return this.userService.update(id, { photo_de_profil: photoDeProfil });
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    console.log('Received signup request:', createUserDto);
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
}
