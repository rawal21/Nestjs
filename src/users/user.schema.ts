import { Schema , SchemaFactory , Prop ,  } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocumant = HydratedDocument<User>;

@Schema()
export class User{

  @Prop({required : true})
  name : string 
  @Prop({required : true})
  email : string 
  @Prop({required : true})
  password : string
  @Prop({default : "author" ,  enum : ["author" , "admin"]})
  role : string 
}

export const UserSchema =   SchemaFactory.createForClass(User);