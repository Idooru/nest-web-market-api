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

  async uploadImageForProduct(
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
    const image = file.filename;

    const upload = await this.uploadRepository.uploadImageForProduct({
      url: image,
      uploader: userAuthObject,
    });

    return upload;
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
