import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Bookmark extends Document {
  @Prop({ required: true })
  userId: string; // ID de l'utilisateur

  @Prop({ required: true })
  movieId: string; // ID du film

  @Prop({ default: Date.now })
  dateAjout: Date; // Date d'ajout du bookmark
}

export const BookmarkSchema = SchemaFactory.createForClass(Bookmark);
