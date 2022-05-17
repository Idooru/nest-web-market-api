import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { ProductService } from './product/product.service';
import { AuthController } from './auth/auth.controller';
import { UserController } from './user/user.controller';
import { ProductController } from './product/product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './z.config/typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    AuthModule,
    UserModule,
    ProductModule,
  ],
  controllers: [AuthController, UserController, ProductController],
  providers: [AuthService, UserService, ProductService],
})
export class AppModule {}
