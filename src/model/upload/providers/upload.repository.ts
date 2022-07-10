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
    mediaUploadDto: MediaUploadDto,
  ): Promise<MediaReturnDto> {
    const { media, uploader } = mediaUploadDto;
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

    return { name: media, url: fileNameOnUrl, uploadReason };
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

  async uploadImageForReview(
    mediaUploadDto: MediaUploadDto,
  ): Promise<MediaReturnDto> {
    const { media, uploader } = mediaUploadDto;
    const fileNameOnUrl = `http://localhost:${new ConfigService().get(
      "PORT",
    )}/media/${media}`.toLowerCase();
    const uploadReason = "review";

    await this.imagesRepository.save({
      url: fileNameOnUrl,
      uploader,
      uploadReason,
    });

    return { name: media, url: fileNameOnUrl, uploadReason };
  }

  async uploadVideoForReview(
    mediaUploadDto: MediaUploadDto,
  ): Promise<MediaReturnDto> {
    const { media, uploader } = mediaUploadDto;
    const fileNameOnUrl = `http://localhost:${new ConfigService().get(
      "PORT",
    )}/media/${media}`.toLowerCase();
    const uploadReason = "review";

    await this.videosRepository.save({
      url: fileNameOnUrl,
      uploader,
      uploadReason,
    });

    return { name: media, url: fileNameOnUrl, uploadReason };
  }

  async uploadImageForInquiry(
    mediaUploadDto: MediaUploadDto,
  ): Promise<MediaReturnDto> {
    const { media, uploader } = mediaUploadDto;
    const fileNameOnUrl = `http://localhost:${new ConfigService().get(
      "PORT",
    )}/media/${media}`.toLowerCase();
    const uploadReason = "inquiry";

    await this.imagesRepository.save({
      url: fileNameOnUrl,
      uploader,
      uploadReason,
    });

    return { name: media, url: fileNameOnUrl, uploadReason };
  }

  async uploadVideoForInquiry(
    mediaUploadDto: MediaUploadDto,
  ): Promise<MediaReturnDto> {
    const { media, uploader } = mediaUploadDto;
    const fileNameOnUrl = `http://localhost:${new ConfigService().get(
      "PORT",
    )}/media/${media}`.toLowerCase();
    const uploadReason = "inquiry";

    await this.videosRepository.save({
      url: fileNameOnUrl,
      uploader,
      uploadReason,
    });

    return { name: media, url: fileNameOnUrl, uploadReason };
  }

  async findImageWithUrl(url: string): Promise<ImagesEntity> {
    try {
      return await this.imagesRepository
        .createQueryBuilder("image")
        .where("image.url = :url", { url })
        .getOneOrFail();
    } catch (err) {
      throw new NotFoundException("해당 url을 가진 이미지를 찾을 수 없습니다.");
    }
  }

  async findVideoWithUrl(url: string): Promise<VideosEntity> {
    try {
      return await this.videosRepository
        .createQueryBuilder("video")
        .where("video.url = :url", { url })
        .getOneOrFail();
    } catch (err) {
      throw new NotFoundException("해당 url을 가진 동영상을 찾을 수 없습니다.");
    }
  }

  async deleteUploadImageWithId(id: string): Promise<void> {
    await this.imagesRepository.delete(id);
  }

  async deleteUploadVideoWithId(id: string): Promise<void> {
    await this.videosRepository.delete(id);
  }
}
