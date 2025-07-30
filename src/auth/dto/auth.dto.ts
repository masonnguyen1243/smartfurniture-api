import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({ example: 'john doe' })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'johndoe@gmail.com' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @ApiProperty({ example: '123456789' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}

export class LoginUserDto {
  @ApiProperty({ example: 'johndoe@gmail.com' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @ApiProperty({ example: '123456789' })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  password: string;
}

export class VerifyUserDto {
  @ApiProperty({ example: 'johndoe@gmail.com' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @ApiProperty({ example: '83920139012' })
  @IsNotEmpty({ message: 'Token is required' })
  @IsString()
  verifyToken: string;
}
