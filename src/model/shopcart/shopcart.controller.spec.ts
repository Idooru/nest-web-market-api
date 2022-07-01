import { Test, TestingModule } from '@nestjs/testing';
import { ShopcartController } from './shopcart.controller';
import { ShopcartService } from './shopcart.service';

describe('ShopcartController', () => {
  let controller: ShopcartController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShopcartController],
      providers: [ShopcartService],
    }).compile();

    controller = module.get<ShopcartController>(ShopcartController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
