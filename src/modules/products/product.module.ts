import { Module } from '@nestjs/common';
import { ProductController } from '@/modules/products/product.controller';
import { ProductService } from '@/modules/products/product.service';
import { PrismaService } from 'src/prisma.service';
import { JwtStrategy } from '@/auth/passport/jwt.strategy';
import { PrismaModule } from '@/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProductController],
  providers: [ProductService, PrismaService, JwtStrategy],
})
export class ProductModule {}
