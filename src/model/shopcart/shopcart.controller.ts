import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShopcartService } from './shopcart.service';
import { CreateShopcartDto } from './dto/create-shopcart.dto';
import { UpdateShopcartDto } from './dto/update-shopcart.dto';

@Controller('shopcart')
export class ShopcartController {
  constructor(private readonly shopcartService: ShopcartService) {}

  @Post()
  create(@Body() createShopcartDto: CreateShopcartDto) {
    return this.shopcartService.create(createShopcartDto);
  }

  @Get()
  findAll() {
    return this.shopcartService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shopcartService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShopcartDto: UpdateShopcartDto) {
    return this.shopcartService.update(+id, updateShopcartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shopcartService.remove(+id);
  }
}
