import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Post } from 'src/posts/post.schema';
import { User } from 'src/users/user.schema';

export type CommentDocumant = HydratedDocument<Comments>;

@Schema()
export class Comments {
  @Prop({ required: true })
  text: string;

  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  author: User;
  @Prop({ type: Types.ObjectId, ref: Post.name, required: true })
  post: Post;
  @Prop({ type: Types.ObjectId, ref: Comments.name, default: null })
  parentComment: Comments | null;
}

export const CommentSchema = SchemaFactory.createForClass(Comments);
