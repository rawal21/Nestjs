import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comments } from './comments.schema';
import { Model } from 'mongoose';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comments.name) private commentModel: Model<Comments>,
  ) {}

  async createComment(data, userId: string, postId: string) {
    return this.commentModel.create({
      text: data.text,
      post: postId,
      author: userId,
      parentComment: data?.parentComment || null,
    });
  }

  async getAllComment(postId: string) {
    return this.commentModel
      .find({ post: postId, parentComment: null })
      .populate('author', 'name  , email')
      .populate({
        path: 'replies',
      });
  }

  async deleteComment(commentId: string, user) {
    const comment = await this.commentModel.findById({ commentId });
    if (!comment) return null;

    if (user.role !== 'admin' && comment.author.toString() !== user.userId) {
      throw new UnauthorizedException('You cannot delete this comment.');
    }

    return comment.deleteOne();
  }
}
