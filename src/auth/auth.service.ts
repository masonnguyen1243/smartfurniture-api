import { RegisterUserDto } from '@/auth/dto/auth.dto';
import { PrismaService } from '@/prisma.service';
import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { hashPasswordHelper } from '@/helpers/utils';
import { MailerService } from '@nestjs-modules/mailer';

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
}
