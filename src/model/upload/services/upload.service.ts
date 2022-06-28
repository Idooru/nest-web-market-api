import { UserActivityEntity } from "src/model/user/entities/user.activity.entity";
import { UserRepository } from "./../../user/user.repository";
import { UploadRepository } from "../../upload/upload.repository";
import { BadRequestException, Injectable } from "@nestjs/common";
import { ImageReturnDto } from "../../upload/dto/image-return.dto";
import { JwtPayload } from "src/common/interfaces/jwt-payload.interface";

@Injectable()
export class UploadService {
  constructor(
    private readonly uploadRepository: UploadRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async uploadImgForProduct(
    file: Express.Multer.File,
    jwtPayload: JwtPayload,
  ): Promise<ImageReturnDto> {
    if (!file) {
      throw new BadRequestException(
        "사진을 업로드 할 수 없습니다. 사진을 제시해 주세요.",
      );
    }

    const userAuthObject = await this.userRepository.findUserAuthWithNickName(
      jwtPayload.nickname,
    );
    const uploadedImage = file.filename;

    const upload = await this.uploadRepository.uploadImgForProduct({
      uploadedImage,
      uploader: userAuthObject,
    });

    const imageFound = await this.uploadRepository.getImageIdWithUploadedImage(
      uploadedImage,
    );
    const uploaderId = jwtPayload.id;

    await this.userRepository.insertImageForUserActivity(
      uploaderId,
      imageFound,
    );

    return upload;
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
