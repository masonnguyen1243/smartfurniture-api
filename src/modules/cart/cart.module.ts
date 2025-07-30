import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { JwtStrategy } from '@/auth/passport/jwt.strategy';
import { PrismaModule } from '@/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CartController],
  providers: [CartService, JwtStrategy],
})
export class CartModule {}
