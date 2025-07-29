import { Body, Controller, Get, Put, Req, Res } from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';
import { UpdateUserDto } from '@/modules/user/dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  getProfile(@Req() req) {
    console.log(req.user);
    return req.user;
  }

  @Put('update')
  async updateProfile(
    @Req() req,
    @Res() res,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const userId = req.user.userId;

      const user = await this.userService.updateProfile(userId, updateUserDto);

      return res.status(200).json(user);
    } catch (error) {
      return res.status(error.status || 500).json({
        message: error.message || 'Internal Server Error',
        success: false,
      });
    }
  }
}
