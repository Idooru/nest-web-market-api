import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { UploadService } from "./upload.service";
import { ImageUploadDto } from "./dto/image-upload.dto";
import { ImageReturnDto } from "./dto/image-return.dto";

@Controller("upload")
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  create(@Body() createUploadDto: ImageUploadDto) {
    return this.uploadService.create(createUploadDto);
  }

  @Get()
  findAll() {
    return this.uploadService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.uploadService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUploadDto: ImageReturnDto) {
    return this.uploadService.update(+id, updateUploadDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.uploadService.remove(+id);
  }
}
