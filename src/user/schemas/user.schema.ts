import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  nom_d_utilisateur: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  mot_de_passe: string;

  @Prop()
  photo_de_profil: string;

  @Prop({ default: Date.now })
  date_de_creation: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
