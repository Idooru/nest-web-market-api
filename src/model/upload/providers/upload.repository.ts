import { UserRepository } from "../../user/providers/user.repository";
import { MediaUploadDto } from "../dto/media-upload.dto";
import { MediaReturnDto } from "../dto/media-return.dto";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ImagesEntity, VideosEntity } from "../entities/upload.entity";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";

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
    imageUploadDto: MediaUploadDto,
  ): Promise<MediaReturnDto> {
    const { media, uploader } = imageUploadDto;
    const fileNameOnUrl = `http://localhost:${new ConfigService().get(
      "PORT",
    )}/media/${media}`.toLowerCase();
    const uploadReason = media.includes("imagepreparation")
      ? "product no image"
      : "product image";

    await this.imagesRepository.save({
      url: fileNameOnUrl,
      uploader,
      uploadReason,
    });

    const originalName = fileNameOnUrl.replace(
      `http://localhost:${new ConfigService().get("PORT")}/media/`,
      "",
    );

    return { name: originalName, url: fileNameOnUrl, uploadReason };
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
        "데이터베이스에서 이미지 준비 이미지를 찾을 수가 없습니다. 먼저 이미지 준비 이미지를 업로드 해주세요.",
      );
    }
  }

  async uploadImageForReview(videoUploadDto: MediaUploadDto) {
    const { media, uploader } = videoUploadDto;
    const fileNameOnUrl = `http://localhost:${new ConfigService().get(
      "PORT",
    )}/media/${media}`.toLowerCase();
    const uploadReason = "review";

    await this.imagesRepository.save({
      url: fileNameOnUrl,
      uploader,
      uploadReason,
    });

    const originalName = fileNameOnUrl.replace(
      `http://localhost:${new ConfigService().get("PORT")}/media/`,
      "",
    );

    return { name: originalName, url: fileNameOnUrl, uploadReason };
  }

  async uploadVideoForReview(videoUploadDto: MediaUploadDto) {
    const { media, uploader } = videoUploadDto;
    const fileNameOnUrl = `http://localhost:${new ConfigService().get(
      "PORT",
    )}/media/${media}`.toLowerCase();
    const uploadReason = "review";

    const video = await this.videosRepository.save({
      url: fileNameOnUrl,
      uploader,
      uploadReason,
    });

    console.log(video);

    const originalName = fileNameOnUrl.replace(
      `http://localhost:${new ConfigService().get("PORT")}/media/`,
      "",
    );

    return { name: originalName, url: fileNameOnUrl, uploadReason };
  }

  async uploadImageForInquiry(videoUploadDto: MediaUploadDto) {
    const { media, uploader } = videoUploadDto;
    const fileNameOnUrl = `http://localhost:${new ConfigService().get(
      "PORT",
    )}/media/${media}`.toLowerCase();
    const uploadReason = "inquiry";

    await this.imagesRepository.save({
      url: fileNameOnUrl,
      uploader,
      uploadReason,
    });

    const originalName = fileNameOnUrl.replace(
      `http://localhost:${new ConfigService().get("PORT")}/media/`,
      "",
    );

    return { name: originalName, url: fileNameOnUrl, uploadReason };
  }

  async uploadVideoForInquiry(videoUploadDto: MediaUploadDto) {
    const { media, uploader } = videoUploadDto;
    const fileNameOnUrl = `http://localhost:${new ConfigService().get(
      "PORT",
    )}/media/${media}`.toLowerCase();
    const uploadReason = "inquiry";

    const video = await this.videosRepository.save({
      url: fileNameOnUrl,
      uploader,
      uploadReason,
    });

    console.log(video);

    const originalName = fileNameOnUrl.replace(
      `http://localhost:${new ConfigService().get("PORT")}/media/`,
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

  async deleteUploadFileWithId(id: string) {
    return await this.imagesRepository.delete(id);
  }
}
