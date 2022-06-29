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

  async uploadImageForProduct(
    imageUploadDto: ImageUploadDto,
  ): Promise<ImageReturnDto> {
    const { uploader, url } = imageUploadDto;
    const fileNameOnUrl = `http://localhost:${process.env.PORT}/media/${url}`;

    const image = await this.imagesRepository.save({
      url: fileNameOnUrl,
      uploader,
      uploadReason: "product upload",
    });

    console.log(image);

    const originalName = fileNameOnUrl.replace(
      `http://localhost:${process.env.PORT}/media/`,
      "",
    );

    return { name: originalName, url: fileNameOnUrl };
  }

  async findImageForProductWithoutImage(): Promise<ImagesEntity> {
    return await this.imagesRepository
      .createQueryBuilder("i")
      .where("i.id = :id", { id: "a63f7beb-e136-4492-b3a9-673bbcb9c4f6" })
      .getOne();
  }

  async findImageWithUploadedImage(
    imageId: ImagesEntity | string,
  ): Promise<ImagesEntity> {
    return await this.imagesRepository.findOne({
      select: ["id"],
      where: { url: imageId },
    });
  }
}
