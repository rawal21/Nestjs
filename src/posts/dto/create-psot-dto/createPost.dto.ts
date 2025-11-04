import { IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreatePostDto{
  @IsString()
  @IsNotEmpty()
  title : string
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  content : string

  @IsString()
  @IsNotEmpty()
  slug : string 

  @IsString()
  @IsNotEmpty()
  author : string 

  @IsString()
  @IsOptional()
  tags? : string[]
  
  @IsString()
  @IsOptional()
  category : string
}