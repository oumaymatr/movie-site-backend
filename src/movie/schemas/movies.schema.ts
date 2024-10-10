import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Movie extends Document {
  @Prop({ required: true })
  titre: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  affiche: string;

  @Prop({ required: true })
  note: string;

  @Prop({ required: true })
  date_de_sortie: Date;

  @Prop({ type: [String], required: true })
  categories: string[];
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
