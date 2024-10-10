import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBookmarkDto {
  @IsNotEmpty()
  @IsString()
  userId: string; // ID de l'utilisateur

  @IsNotEmpty()
  @IsString()
  movieId: string; // ID du film
}
