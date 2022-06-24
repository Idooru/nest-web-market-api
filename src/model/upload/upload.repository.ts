import { UserRepository } from "./../user/user.repository";
import { ImageUploadDto } from "./dto/image-upload.dto";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ImagesEntity, VideosEntity } from "./entities/upload.entity";
import { Repository } from "typeorm";
import { ImageReturnDto } from "./dto/image-return.dto";

@Injectable()
export class UploadRepository {
  constructor(
    @InjectRepository(ImagesEntity)
    private readonly imagesRepository: Repository<ImagesEntity>,
    @InjectRepository(VideosEntity)
    private readonly videosRepository: Repository<VideosEntity>,
    private readonly userRepository: UserRepository,
  ) {}

  async uploadImg(imageUploadDto: ImageUploadDto): Promise<ImageReturnDto> {
    const { uploader, imageFileName } = imageUploadDto;
    const fileNameOnUrl = `http://localhost:${process.env.PORT}/media/${imageFileName}`;

    const image = await this.imagesRepository.save({
      imageFileName: fileNameOnUrl,
      uploader,
    });

    const imageId: ImagesEntity = await this.imagesRepository.findOne({
      where: { uploader },
      select: ["id"],
      order: { createdAt: "DESC" },
    });

    await this.userRepository.findUserAndInsertImageForUser(uploader, imageId);

    console.log(image);

    const originalName = fileNameOnUrl.replace(
      `http://localhost:${process.env.PORT}/media/`,
      "",
    );

    return { name: originalName, url: fileNameOnUrl };
  }

  async findImageIdWithImageFileName(imageId: ImagesEntity | string) {
    return await this.imagesRepository.findOne({
      select: ["id"],
      where: { imageFileName: imageId },
    });
  }
}
