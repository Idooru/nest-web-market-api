import { UserRepository } from "./../../user/user.repository";
import { UploadRepository } from "../../upload/upload.repository";
import { BadRequestException, Injectable } from "@nestjs/common";
import { ImageReturnDto } from "../../upload/dto/image-return.dto";
import { JwtPayload } from "src/common/interfaces/jwt-payload.interface";

import * as fs from "fs";
import * as path from "path";

@Injectable()
export class UploadService {
  constructor(
    private readonly uploadRepository: UploadRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async uploadImageForProduct(
    file: Express.Multer.File,
    jwtPayload: JwtPayload,
  ): Promise<ImageReturnDto> {
    if (!file) {
      throw new BadRequestException(
        "사진을 업로드 할 수 없습니다. 사진을 제시해 주세요.",
      );
    }

    const user = await this.userRepository.findUserWithNickName(
      jwtPayload.nickname,
    );

    const image = file.filename;

    return await this.uploadRepository.uploadImageForProduct({
      url: image,
      uploader: user,
    });
  }

  async copyImageFromImagePreparation(
    creater: string,
  ): Promise<ImageReturnDto> {
    const uploader = await this.userRepository.findUserWithNickName(creater);

    // 상품 준비 이미지를 가져온다.
    const imagePreparation = await this.uploadRepository.findImagePreparation();
    const parseUrl = imagePreparation.url.slice(28);
    const src = path.join(__dirname, `../../../../uploads/image/${parseUrl}`);
    const dest = path.join(
      __dirname,
      `../../../../uploads/image/imagepreparation-${Date.now()}.jpg`,
    );

    fs.copyFileSync(src, dest);

    const image = dest.replace(
      "/root/Coding/nodejs/nest_project/nestWebMarket_API/uploads/image/",
      "",
    );

    return await this.uploadRepository.uploadImageForProduct({
      url: image,
      uploader,
    });
  }

  // async uploadVideo(
  //   files: Array<Express.Multer.File>,
  //   jwtPayload: JwtPayload,
  // ): Promise<void> {
  //   const videoUrls: VideoReturnDto[] = [];
  //   const author = jwtPayload.nickname;

  //   if (!files.length) {
  //     throw new BadRequestException(
  //       "동영상을 업로드 할 수 없습니다. 동영상을 제시해주세요.",
  //     );
  //   } else if (files.length >= 2) {
  //     for (const index of files) {
  //       const fileName = index.filename;
  //       const originalName = index.originalname;
  //       videoUrls.push(
  //         await this.uploadRepository.uploadImg({
  //           fileName,
  //           author,
  //           originalName,
  //         }),
  //       );
  //     }
  //   } else {
  //     const fileName = files[0].filename;
  //     const originalName = files[0].originalname;

  //     videoUrls.push(
  //       await this.uploadRepository.uploadImg({
  //         fileName,
  //         author,
  //         originalName,
  //       }),
  //     );
  //   }

  //   return videoUrls;
  // }

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
