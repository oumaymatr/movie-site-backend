import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsIn,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  nom_d_utilisateur: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  mot_de_passe: string;

  @IsOptional()
  @IsString()
  photo_de_profil?: string;

  @IsOptional()
  @IsString()
  @IsIn(['user', 'admin'])
  role?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  bookmarks?: string[];
}
