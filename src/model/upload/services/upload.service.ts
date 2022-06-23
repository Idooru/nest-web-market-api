import { UploadRepository } from "../../upload/upload.repository";
import { BadRequestException, Injectable } from "@nestjs/common";
import { ImageReturnDto } from "../../upload/dto/image-return.dto";
import { JwtPayload } from "src/common/interfaces/jwt-payload.interface";

@Injectable()
export class UploadService {
  constructor(private readonly uploadRepository: UploadRepository) {}
  async uploadImgForProduct(
    file: Express.Multer.File,
    jwtPayload: JwtPayload,
  ): Promise<ImageReturnDto> {
    const uploader = jwtPayload.nickName;

    if (!file) {
      throw new BadRequestException(
        "사진을 업로드 할 수 없습니다. 사진을 제시해 주세요.",
      );
    } else {
      const imageFileName = file.filename;

      return await this.uploadRepository.uploadImg({
        imageFileName,
        uploader,
      });
    }
  }

  // create(createUploadDto: ImageUploadDto) {
  //   return "This action adds a new upload";
  // }

  // findAll() {
  //   return `This action returns all upload`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} upload`;
  // }

  // update(id: number, updateUploadDto: ImageReturnDto) {
  //   return `This action updates a #${id} upload`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} upload`;
  // }
}
