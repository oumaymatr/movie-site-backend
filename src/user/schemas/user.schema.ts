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

  @Prop({
    default:
      'https://static.vecteezy.com/system/resources/previews/026/434/409/non_2x/default-avatar-profile-icon-social-media-user-photo-vector.jpg',
  })
  photo_de_profil?: string;

  @Prop({ default: Date.now })
  date_de_creation: Date;

  @Prop({ default: 'user' })
  role: string;

  @Prop({ type: [String], default: [] })
  bookmarks: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
