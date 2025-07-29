import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Res,
  Put,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { LoginUserDto, RegisterUserDto } from '@/auth/dto/auth.dto';
import { Public } from '@/decorators/customize';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  async register(@Body() registerUserDto: RegisterUserDto, @Res() res) {
    try {
      const result = await this.authService.register(registerUserDto);
      return res.status(200).json(result);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('login')
  @Public()
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    try {
      const result = await this.authService.login(loginUserDto);

      res.cookie('accessToken', result?.accessToken, {
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
        httpOnly: true,
        sameSite: 'strict',
      });

      return res.status(200).json(result);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Public()
  @Get('logout')
  async logout(@Res() res: Response) {
    try {
      const result = await this.authService.logout();

      res.clearCookie('accessToken');

      return res.status(200).json(result);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
