import { IsNotEmpty } from 'class-validator';

export class UploadPhotoDto {
  @IsNotEmpty()
  readonly photo: Express.Multer.File;
}
