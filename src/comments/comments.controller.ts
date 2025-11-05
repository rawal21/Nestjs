import {
  Body,
  Controller,
  Param,
  UseGuards,
  Req,
  Post,
  Get,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/comment.dto';
@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentsController {
  constructor(private commentService: CommentsService) {}
  @Post(':postId')
  create(
    @Param('postId') postId: string,
    @Body() body: CreateCommentDto,
    @Req() req,
  ) {
    return this.commentService.createComment(body, postId, req.user.userId);
  }

  @Get(':postId')
  getAllComment(@Param('postId') postId: string) {
    return this.commentService.getAllComment(postId);
  }

  @Delete(':commentId')
  delete(@Param('commentId') commentId: string, @Req() req) {
    return this.commentService.deleteComment(commentId, req.user);
  }
}
