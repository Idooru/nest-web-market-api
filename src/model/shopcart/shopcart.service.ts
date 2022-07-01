import { Injectable } from '@nestjs/common';
import { CreateShopcartDto } from './dto/create-shopcart.dto';
import { UpdateShopcartDto } from './dto/update-shopcart.dto';

@Injectable()
export class ShopcartService {
  create(createShopcartDto: CreateShopcartDto) {
    return 'This action adds a new shopcart';
  }

  findAll() {
    return `This action returns all shopcart`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shopcart`;
  }

  update(id: number, updateShopcartDto: UpdateShopcartDto) {
    return `This action updates a #${id} shopcart`;
  }

  remove(id: number) {
    return `This action removes a #${id} shopcart`;
  }
}
