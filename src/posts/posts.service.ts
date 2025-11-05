import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './post.schema';
import { CreatePostDto } from './dto/create-psot-dto/createPost.dto';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async createPost(data: CreatePostDto, userId: string, imageUrl?: string) {
    const slug = data.title.toLowerCase().replace(/\s+/g, '-');

    const newPost = await this.postModel.create({
      ...data,
      slug,
      image: imageUrl ?? null, // ✅ store image url
      author: userId,
    });

    return newPost;
  }

  async findAll(query) {
    const { page = 1, limit = 5, search = '' } = query;

    return this.postModel
      .find({ title: { $regex: search, $options: 'i' } })
      .populate('author', 'name email role')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .exec();
  }

  async findBySlug(slug: string) {
    return this.postModel.findOne({ slug }).populate('author', 'name email');
  }

  async deletePost(slug: string, user: any) {
    const post = await this.postModel.findOne({ slug });
    if (!post) return null;

    if (user.role !== 'admin' && post.author.toString() !== user.userId) {
      throw new UnauthorizedException('You cannot delete this post.');
    }

    return post.deleteOne();
  }
}
