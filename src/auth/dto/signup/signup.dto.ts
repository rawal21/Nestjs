import { IsString , IsNotEmpty, IsEmail } from "class-validator";

export class CreateSignUpDto {
  @IsString()
  name : string
  @IsEmail()
  email : string 
  @IsNotEmpty()
  password : string
}