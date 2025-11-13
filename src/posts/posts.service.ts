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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const page = Math.max(1, Number(query.page) || 1);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const limit = Math.max(1, Number(query.limit) || 10);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const search = query.search || '';
    const skip = (page - 1) * limit;

    // Filter condition
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const filter = { title: { $regex: search, $options: 'i' } };

    // Fetch posts
    const posts = await this.postModel
      .find(filter)
      // eslint-disable-next-line prettier/prettier
      .populate('author', 'name email role')
      .skip(skip)
      .limit(limit)
      .exec();

    // Count total documents
    const totalPosts = await this.postModel.countDocuments(filter);

    // Return both
    return {
      posts,
      totalPosts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
    };
  }

  async findBySlug(slug: string) {
    return this.postModel.findOne({ slug }).populate('author', 'name email');
  }

  async deletePost(slug: string, user: any) {
    const post = await this.postModel.findOne({ slug });
    if (!post) return null;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (user.role !== 'admin' && post.author.toString() !== user.userId) {
      throw new UnauthorizedException('You cannot delete this post.');
    }

    return post.deleteOne();
  }
}
