import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './post.schema';
import { Model } from 'mongoose';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel : Model<Post>){}

  async createPost(data , userId)
  {
      const slug = data.title.toLowerCase().replace(/\s+/g, '-');
      const newpost = await this.postModel.create({
        ...data,
        slug ,
        author : userId
      });

      return newpost.save();
  }

  async findAll(query)
  {
    const {page = 1 , limit = 5 , search = ''} = query ;
     return this.postModel
      .find({ title: { $regex: search, $options: 'i' } })
      .populate('author', 'name email role')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .exec();
  }

  async findBySlug(slug)
  {
    return this.postModel.findOne({slug}).populate("author" ,' name email')
  }

  async deletePost(slug , user)
  {
    const post = await this.postModel.findOne({slug});
    if(!post) return null;

    if(user.role === 'admin' || post.author.toString() === user.userId )
    {
       return post.deleteOne();
    }

    return "Unauthorized to delete this post."

  }
}
