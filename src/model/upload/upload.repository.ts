import { UserRepository } from "./../user/user.repository";
import { ImageUploadDto } from "./dto/image-upload.dto";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ImagesEntity, VideosEntity } from "./entities/upload.entity";
import { Repository } from "typeorm";
import { ImageReturnDto } from "./dto/image-return.dto";
import { UserCommonEntity } from "../user/entities/user.common.entity";

@Injectable()
export class UploadRepository {
  constructor(
    @InjectRepository(ImagesEntity)
    private readonly imagesRepository: Repository<ImagesEntity>,
    @InjectRepository(VideosEntity)
    private readonly videosRepository: Repository<VideosEntity>,
    private readonly userRepository: UserRepository,
  ) {}

  async uploadImgForProduct(
    imageUploadDto: ImageUploadDto,
  ): Promise<ImageReturnDto> {
    const { uploader, uploadedImage } = imageUploadDto;
    const fileNameOnUrl = `http://localhost:${process.env.PORT}/media/${uploadedImage}`;
    const strUploader: string = uploader.nickname;

    const userId = await this.userRepository.findUserWithNickName(strUploader);

    const image = await this.imagesRepository.save({
      uploadedImage: fileNameOnUrl,
      uploader: userId,
      uploadPurpose: "product upload",
    });

    console.log(image);

    const originalName = fileNameOnUrl.replace(
      `http://localhost:${process.env.PORT}/media/`,
      "",
    );

    return { name: originalName, url: fileNameOnUrl };
  }

  async findImageIdWithUploadedImage(
    imageId: ImagesEntity | string,
  ): Promise<ImagesEntity> {
    return await this.imagesRepository.findOne({
      select: ["id"],
      where: { uploadedImage: imageId },
    });
  }

  async getImageIdWithUploadedImage(uploadedImage: string) {
    const plusUrl =
      `http://localhost:${process.env.PORT}/media/` + uploadedImage;
    return await this.imagesRepository.findOne({
      where: { uploadedImage: plusUrl },
      select: ["id"],
    });
  }

  // async insertImageForUser(userId: string, imageId: string) {
  //   return await this.userRepository.insertImageForUser(userId, imageId);
  // }
}
