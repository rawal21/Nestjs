import { Controller, Delete, Get, Injectable, Param, Query, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-psot-dto/createPost.dto';
import { Post , Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';


@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private postService : PostsService){}
 
  @Post()
   create(@Body() body : CreatePostDto , @Req()  req)
   {
     console.log(req.user);
     return this.postService.createPost(body , req.user.userId);
   }

   @Get()
    findAll(@Query() query )
    {
      return this.postService.findAll(query);
    }

    @Get(':slug')
    getSingle(@Param('slug')  slug : string)
    {
      return this.postService.findBySlug(slug);
    }

    @Delete(':slug')
    
      delete(@Param('slug')  slug : string , @Req() req)
      {
        return this.postService.deletePost(slug ,  req.user)
      }
    

}
