import { ApiProperty } from '@nestjs/swagger';

export class CreateLoginDto {
  @ApiProperty({ example: 'john@gmail.com', description: 'User email address' })
  email: string;

  @ApiProperty({ example: '123456', description: 'User password' })
  password: string;
}
