import { Controller, Post, Body, Req } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { LoginUserDto, RegisterUserDto } from '@/auth/dto/auth.dto';
import { Public } from '@/decorators/customize';

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
  login(@Body() loginUserDto: LoginUserDto, @Req() req) {
    return this.authService.login(loginUserDto);
  }
}
