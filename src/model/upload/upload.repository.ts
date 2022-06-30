import { UserRepository } from "./../user/user.repository";
import { ImageUploadDto } from "./dto/image-upload.dto";
import { Injectable, NotFoundException } from "@nestjs/common";
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
    const fileNameOnUrl =
      `http://localhost:${process.env.PORT}/media/${url}`.toLowerCase();
    const uploadReason = url.includes("imagepreparation")
      ? "product no image"
      : "product image";

    const image = await this.imagesRepository.save({
      url: fileNameOnUrl,
      uploader,
      uploadReason,
    });

    console.log(image);

    const originalName = fileNameOnUrl.replace(
      `http://localhost:${process.env.PORT}/media/`,
      "",
    );

    return { name: originalName, url: fileNameOnUrl, uploadReason };
  }

  async findImageWithUrl(url: string): Promise<ImagesEntity> {
    return await this.imagesRepository
      .createQueryBuilder("i")
      .where("i.url = :url", { url })
      .getOne();
  }

  async findImagePreparation(): Promise<ImagesEntity> {
    try {
      return await this.imagesRepository
        .createQueryBuilder("i")
        .where("i.uploadReason = :uploadReason", {
          uploadReason: "product no image",
        })
        .orderBy("i.createdAt", "ASC")
        .getOneOrFail();
    } catch (err) {
      throw new NotFoundException(
        "이미지 준비 이미지를 찾을 수가 없습니다. 먼저 이미지 준비 이미지를 업로드 해주세요.",
      );
    }
  }

  // async findImageWithoutImage(url: string): Promise<ImagesEntity> {
  //   return await this.imagesRepository
  //     .createQueryBuilder("i")
  //     .where("i.url = :url", { url })
  //     .getOne();
  // }

  // async findImageWithUploadedImage(url: ImagesEntity): Promise<ImagesEntity> {
  //   return await this.imagesRepository.findOne({
  //     select: ["id"],
  //     where: { url },
  //   });
  // }
}
