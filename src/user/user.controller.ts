import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    console.log('Received signup request:', createUserDto);
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  // Individual update routes for each field
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

  @Put(':id/password')
  async updatePassword(
    @Param('id') id: string,
    @Body('mot_de_passe') mot_de_passe: string,
  ): Promise<User> {
    return this.userService.update(id, { mot_de_passe });
  }

  @Put(':id/profile-picture')
  async updateProfilePicture(
    @Param('id') id: string,
    @Body('photo_de_profil') photo_de_profil: string,
  ): Promise<User> {
    return this.userService.update(id, { photo_de_profil });
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<User> {
    return this.userService.remove(id);
  }
}
