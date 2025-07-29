import { RegisterUserDto } from '@/auth/dto/auth.dto';
import { PrismaService } from '@/prisma.service';
import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(registerUserDto: RegisterUserDto) {
    const { name, email, password } = registerUserDto;
    if (!name || !email || !password) {
      throw new BadGatewayException('Required fields are missing');
    }
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        verityToken: uuidv4(),
      },
    });

    if (!user) {
      throw new BadRequestException('User registration failed');
    }

    return { user, success: true, message: 'User registered successfully' };
  }
}
