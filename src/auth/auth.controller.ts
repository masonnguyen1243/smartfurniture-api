import { Controller, Post, Body, Req, Get, Res } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { LoginUserDto, RegisterUserDto } from '@/auth/dto/auth.dto';
import { Public } from '@/decorators/customize';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
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
      return res.status(error.status || 500).json({
        message: error.message || 'Internal Server Error',
        success: false,
      });
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
      return res.status(error.status || 500).json({
        message: error.message || 'Internal Server Error',
        success: false,
      });
    }
  }
}
