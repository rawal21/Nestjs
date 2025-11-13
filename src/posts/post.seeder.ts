import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post } from './post.schema';
import { CreatePostDto } from './dto/create-psot-dto/createPost.dto';
@Injectable()
export class PostSeeder implements OnModuleInit {
  constructor(
    @InjectModel(Post.name)
    private postModel: Model<Post>,
  ) {}

  async onModuleInit() {
    console.log('🌱 Running Random Blog Seeder...');

    const count = await this.postModel.countDocuments();
    if (count > 0) {
      console.log('✅ Posts already exist, skipping random seeding.');
      return;
    }

    const tags = [
      'nestjs',
      'express',
      'mongodb',
      'react',
      'typescript',
      'node',
      'api',
      'backend',
    ];

    const titles = [
      'Why NestJS Beats Express in Large Apps',
      'Understanding Middleware in Node.js',
      'How MongoDB Handles Big Data',
      'React vs Vue – Which one to choose?',
      'Best Practices for REST APIs',
      'Why TypeScript is a must in 2025',
      'Scaling Node Applications',
      'Authentication in Modern Web Apps',
      'Top 10 Tips for Backend Developers',
      'Why Developers Love Open Source',
      'Express vs NestJS – Real Difference',
      'Clean Architecture in JavaScript',
    ];

    const generateSlug = (title: string) =>
      title
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^a-z0-9-]/g, '');

    const randomPosts: CreatePostDto[] = [];

    for (let i = 0; i < 12; i++) {
      const title = titles[Math.floor(Math.random() * titles.length)];

      randomPosts.push({
        title,
        content:
          'This is a randomly generated blog post for testing purposes. It contains simple placeholder text.',
        slug: generateSlug(title) + '-' + i,
        author: new Types.ObjectId('690cd1a8a7a6f608483a3bdd'),
        tags: [tags[Math.floor(Math.random() * tags.length)]],
        category: '',
        imageUrl: '',
      });
    }

    await this.postModel.deleteMany();

    console.log('✅ Random blog seeding completed (12 posts added).');
  }
}
