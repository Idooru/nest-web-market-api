import { Module } from '@nestjs/common';
import { ShopcartService } from './shopcart.service';
import { ShopcartController } from './shopcart.controller';

@Module({
  controllers: [ShopcartController],
  providers: [ShopcartService]
})
export class ShopcartModule {}
