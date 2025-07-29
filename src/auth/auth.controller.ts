import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { RegisterUserDto } from '@/auth/dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }
}
