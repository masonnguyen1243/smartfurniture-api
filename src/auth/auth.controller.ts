import {
  Controller,
  Post,
  Body,
  Get,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import {
  LoginUserDto,
  RegisterUserDto,
  VerifyUserDto,
} from '@/auth/dto/auth.dto';
import { Public } from '@/decorators/customize';
import { Response } from 'express';
import * as ms from 'ms';
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

  @Post('loginnn')
  @Public()
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    try {
      const result = await this.authService.login(loginUserDto);

      res.cookie('accessToken', result?.accessToken, {
        // maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
        maxAge: ms('1d'),
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

  @Public()
  @Post('verify-account')
  async verifyAccount(@Body() verifyUserDto: VerifyUserDto) {
    try {
      return await this.authService.verifyAccount(verifyUserDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
