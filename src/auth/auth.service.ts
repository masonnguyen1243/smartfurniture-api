import { LoginUserDto, RegisterUserDto } from '@/auth/dto/auth.dto';
import { PrismaService } from '@/prisma.service';
import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { comparePasswordHelper, hashPasswordHelper } from '@/helpers/utils';
import { MailerService } from '@nestjs-modules/mailer';
import { log } from 'console';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly mailerService: MailerService,
  ) {}

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

    const hashedPassword = await hashPasswordHelper(password);
    const codeId = uuidv4();
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        verityToken: codeId,
      },
    });

    if (!user) {
      throw new BadRequestException('User registration failed');
    }

    //Send email verification
    this.mailerService.sendMail({
      to: user.email as string,
      subject: 'Activate your account',
      template: 'register',
      context: {
        name: user?.name ?? user?.email,
        activationCode: codeId,
      },
    });

    return { user, success: true, message: 'User registered successfully' };
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    if (!email || !password) {
      throw new BadGatewayException('Required fields are missing');
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('Your account is not active');
    }

    const isValidPassword = await comparePasswordHelper(
      password,
      user.password as string,
    );
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const { password: _, ...rest } = user;

    return {
      success: true,
      message: 'User logged in successfully',
      user: rest,
    };
  }
}
