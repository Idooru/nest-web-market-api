import { Test, TestingModule } from '@nestjs/testing';
import { ShopcartService } from './shopcart.service';

describe('ShopcartService', () => {
  let service: ShopcartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShopcartService],
    }).compile();

    service = module.get<ShopcartService>(ShopcartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
