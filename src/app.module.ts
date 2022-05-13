import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { ProductService } from './product/product.service';

@Module({
  imports: [AuthModule, UserModule, ProductModule],
  providers: [AuthService, UserService, ProductService],
})
export class AppModule {}
