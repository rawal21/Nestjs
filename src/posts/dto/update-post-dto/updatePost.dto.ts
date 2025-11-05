import { CreatePostDto } from '../create-psot-dto/createPost.dto';
import { PartialType } from '@nestjs/mapped-types';
export class UpdatePostDto extends PartialType(CreatePostDto) {}
