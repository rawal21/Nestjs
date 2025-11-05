import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-psot-dto/createPost.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  // ✅ Create post WITHOUT image upload
  @Post()
  create(@Body() body: CreatePostDto, @Req() req) {
    console.log('Logged-in user details:', req.user);

    return this.postService.createPost(body, req.user.userId);
  }

  // ✅ Get all posts (supports pagination/search/remove later)
  @Get()
  findAll(@Query() query) {
    return this.postService.findAll(query);
  }

  // ✅ Get post by slug
  @Get(':slug')
  getSingle(@Param('slug') slug: string) {
    return this.postService.findBySlug(slug);
  }

  // ✅ Delete post (only author/admin - logic already in service)
  @Delete(':slug')
  delete(@Param('slug') slug: string, @Req() req) {
    return this.postService.deletePost(slug, req.user);
  }

  // ✅ Create post WITH IMAGE UPLOAD (local filesystem)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads', // store file inside "uploads/" folder
        filename: (req, file, callback) => {
          const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, uniqueName + extname(file.originalname));
        },
      }),
    }),
  )
  uploadPost(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreatePostDto,
    @Req() req,
  ) {
    return this.postService.createPost(
      {
        ...body,
        imageUrl: `/uploads/${file.filename}`, // store file path
      },
      req.user.userId,
    );
  }
}
