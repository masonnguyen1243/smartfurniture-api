import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductModule } from './modules/products/product.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), CategoriesModule, ProductModule],
  controllers: [AppController],
  providers: [AppService ],
})
export class AppModule {}
