import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '@/prisma.service';
import { AuthModule } from '@/auth/auth.module';
import { UserService } from '@/modules/user/user.service';
import { UserModule } from '@/modules/user/user.module';

@Module({
  imports: [AuthModule, UserModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
  providers: [AppService, PrismaService, UserService],
})
export class AppModule {}
