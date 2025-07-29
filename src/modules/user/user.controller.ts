import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
}
