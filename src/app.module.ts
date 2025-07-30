import { Module } from '@nestjs/common';

import { CategoriesModule } from './modules/categories/categories.module';
import { ProductModule } from './modules/products/product.module';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from '@/prisma.service';
import { AuthModule } from '@/auth/auth.module';
import { UserService } from '@/modules/user/user.service';
import { UserModule } from '@/modules/user/user.module';

import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@/auth/passport/jwt-auth.guard';
import { CartModule } from '@/modules/cart/cart.module';
import { WishlistModule } from '@/modules/wishlist/wishlist.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    CategoriesModule,
    ProductModule,
    CartModule,
    WishlistModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          // ignoreTLS: true,
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: '"No Reply" <no-reply@smartfurniture>',
        },
        // preview: true,
        template: {
          // dir: join(__dirname, 'mail/templates'),
          dir: process.cwd() + '/src/mail/templates/',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    UserService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
