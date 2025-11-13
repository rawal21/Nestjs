import { ApiProperty } from '@nestjs/swagger';

export class CreateSignUpDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  name: string;

  @ApiProperty({ example: 'john@gmail.com', description: 'User email address' })
  email: string;

  @ApiProperty({ example: '123456', description: 'User password' })
  password: string;
}
