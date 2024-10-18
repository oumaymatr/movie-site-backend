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
  photo_de_profil?: string; // This should allow undefined but not empty string

  @IsOptional()
  @IsString()
  @IsIn(['user', 'admin'])
  role?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  bookmarks?: string[];

  // Consider adding a method to set the default profile picture if not provided
  setDefaultProfilePicture() {
    if (!this.photo_de_profil) {
      this.photo_de_profil =
        'https://static.vecteezy.com/system/resources/previews/026/434/409/non_2x/default-avatar-profile-icon-social-media-user-photo-vector.jpg';
    }
  }
}
