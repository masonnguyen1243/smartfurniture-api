import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '@/auth/auth.controller';
import { AuthService } from '@/auth/auth.service';
import {
  LoginUserDto,
  RegisterUserDto,
  VerifyUserDto,
} from '@/auth/dto/auth.dto';
import { Response } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
    verifyAccount: jest.fn(),
  };

  const mockResponse: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    cookie: jest.fn().mockReturnThis(),
    clearCookie: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register user and return result', async () => {
      const dto: RegisterUserDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };
      const result = { message: 'Registered' };
      mockAuthService.register.mockResolvedValue(result);

      await controller.register(dto, mockResponse as Response);

      expect(mockAuthService.register).toHaveBeenCalledWith(dto);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(result);
    });
  });

  describe('login', () => {
    it('should login and set cookie', async () => {
      const dto: LoginUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const result = {
        accessToken: 'mock-token',
        user: { id: 1, email: dto.email },
      };
      mockAuthService.login.mockResolvedValue(result);

      await controller.login(dto, mockResponse as Response);

      expect(mockAuthService.login).toHaveBeenCalledWith(dto);
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'accessToken',
        result.accessToken,
        expect.objectContaining({
          maxAge: expect.any(Number),
          httpOnly: true,
          sameSite: 'strict',
        }),
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(result);
    });
  });

  describe('logout', () => {
    it('should logout and clear cookie', async () => {
      const result = { message: 'Logged out' };
      mockAuthService.logout.mockResolvedValue(result);

      await controller.logout(mockResponse as Response);

      expect(mockAuthService.logout).toHaveBeenCalled();
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('accessToken');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(result);
    });
  });

  describe('verifyAccount', () => {
    it('should verify account and return result', async () => {
      const dto: VerifyUserDto = {
        email: 'test@example.com',
        verifyToken: 'abc123',
      };
      const result = { message: 'Verified' };
      mockAuthService.verifyAccount.mockResolvedValue(result);

      const response = await controller.verifyAccount(dto);

      expect(mockAuthService.verifyAccount).toHaveBeenCalledWith(dto);
      expect(response).toEqual(result);
    });
  });
});
