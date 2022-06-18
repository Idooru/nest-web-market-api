import { Injectable } from "@nestjs/common";
import { ImageUploadDto } from "./dto/image-upload.dto";
import { ImageReturnDto } from "./dto/image-return.dto";

@Injectable()
export class UploadService {
  create(createUploadDto: ImageUploadDto) {
    return "This action adds a new upload";
  }

  findAll() {
    return `This action returns all upload`;
  }

  findOne(id: number) {
    return `This action returns a #${id} upload`;
  }

  update(id: number, updateUploadDto: ImageReturnDto) {
    return `This action updates a #${id} upload`;
  }

  remove(id: number) {
    return `This action removes a #${id} upload`;
  }
}
