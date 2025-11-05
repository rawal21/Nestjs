import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/users/user.schema';
export type PostDocumant = HydratedDocument<Post>;
@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  content: string;
  @Prop({ required: true, unique: true })
  slug: string;
  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  author: string;
  @Prop({ default: [] })
  tags: string[];
  @Prop()
  category: string;
  @Prop()
  imageUrl: string;
}
export const PostSchema = SchemaFactory.createForClass(Post);
