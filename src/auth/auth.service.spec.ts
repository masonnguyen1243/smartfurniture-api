import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '@/auth/auth.service';
import { PrismaService } from '@/prisma.service';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import {
  LoginUserDto,
  RegisterUserDto,
  VerifyUserDto,
} from '@/auth/dto/auth.dto';
import * as utils from '@/helpers/utils';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let mailer: MailerService;
  let jwt: JwtService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockMailer = {
    sendMail: jest.fn(),
  };

  const mockJwt = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: MailerService, useValue: mockMailer },
        { provide: JwtService, useValue: mockJwt },
      ],
    }).compile();

    service = module.get(AuthService);
    prisma = module.get(PrismaService);
    mailer = module.get(MailerService);
    jwt = module.get(JwtService);

    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register user and send email', async () => {
      const dto: RegisterUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
      };

      jest.spyOn(utils, 'hashPasswordHelper').mockResolvedValue('hashedpass');
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({ ...dto, id: 1 });

      const result = await service.register(dto);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: dto.email },
      });
      expect(mockPrisma.user.create).toHaveBeenCalled();
      expect(mailer.sendMail).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });

    it('should throw if user exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 1 });

      await expect(
        service.register({ name: 'A', email: 'a@a.com', password: '123' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      const dto: LoginUserDto = {
        email: 'test@example.com',
        password: '123456',
      };

      mockPrisma.user.findUnique.mockResolvedValue({
        id: '1',
        email: dto.email,
        password: 'hashedpass',
        isActive: true,
      });

      jest.spyOn(utils, 'comparePasswordHelper').mockResolvedValue(true);
      mockJwt.sign.mockReturnValue('mockToken');

      const result = await service.login(dto);

      expect(result.accessToken).toBe('mockToken');
      expect(result.success).toBe(true);
    });

    it('should throw if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({ email: 'x', password: 'y' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw if user is inactive', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ isActive: false });

      await expect(
        service.login({ email: 'x', password: 'y' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw if password is incorrect', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        email: 'x',
        password: 'hashed',
        isActive: true,
      });
      jest.spyOn(utils, 'comparePasswordHelper').mockResolvedValue(false);

      await expect(
        service.login({ email: 'x', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should return success message', async () => {
      const result = await service.logout();
      expect(result.success).toBe(true);
      expect(result.message).toBe('User logged out successfully');
    });
  });

  describe('verifyAccount', () => {
    it('should verify account successfully', async () => {
      const dto: VerifyUserDto = {
        email: 'verify@example.com',
        verifyToken: '1234',
      };

      mockPrisma.user.findUnique.mockResolvedValue({
        email: dto.email,
        verityToken: '1234',
        isActive: false,
      });

      mockPrisma.user.update.mockResolvedValue({});

      const result = await service.verifyAccount(dto);

      expect(result.success).toBe(true);
    });

    it('should throw if token is invalid', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        verityToken: 'wrong',
        isActive: false,
      });

      await expect(
        service.verifyAccount({
          email: 'x',
          verifyToken: 'invalid',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
