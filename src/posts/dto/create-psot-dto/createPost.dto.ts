import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Types } from 'mongoose';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  content: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  author: Types.ObjectId | string;

  @IsString()
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  category: string;

  @IsOptional()
  imageUrl: string;
}
