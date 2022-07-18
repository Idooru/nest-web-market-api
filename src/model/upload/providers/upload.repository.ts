import { UserRepository } from "../../user/providers/user.repository";
import { MediaUploadDto } from "../dto/media-upload.dto";
import { MediaReturnDto } from "../dto/media-return.dto";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductsImageEntity } from "../entities/product.image.entity";
import { ReviewsImageEntity } from "../entities/review.image.entity";
import { ReviewsVideoEntity } from "../entities/review.video.entity";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { ReviewEntity } from "src/model/review/entities/review.entity";

@Injectable()
export class UploadRepository {
  constructor(
    @InjectRepository(ProductsImageEntity)
    private readonly productsImageRepository: Repository<ProductsImageEntity>,
    @InjectRepository(ReviewsImageEntity)
    private readonly reviewsImageRepository: Repository<ReviewsImageEntity>,
    @InjectRepository(ReviewsVideoEntity)
    private readonly reviewsVideoRepository: Repository<ReviewsVideoEntity>,
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

    await this.productsImageRepository.save({
      url: fileNameOnUrl,
      uploader,
      uploadReason,
    });

    return { name: media, url: fileNameOnUrl };
  }

  async findImagePreparation(): Promise<ProductsImageEntity> {
    try {
      return await this.productsImageRepository
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

    await this.reviewsImageRepository.save({
      url: fileNameOnUrl,
      uploader,
    });

    return { name: media, url: fileNameOnUrl };
  }

  async uploadVideoForReview(
    mediaUploadDto: MediaUploadDto,
  ): Promise<MediaReturnDto> {
    const { media, uploader } = mediaUploadDto;
    const fileNameOnUrl = `http://localhost:${new ConfigService().get(
      "PORT",
    )}/media/${media}`.toLowerCase();
    const uploadReason = "review";

    await this.reviewsVideoRepository.save({
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

    await this..save({
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

  async insertImageOnReview(id: string, review: ReviewEntity) {
    const image = await this.imagesRepository
      .createQueryBuilder("image")
      .where("image.id = :id", { id })
      .getOne();

    image.Review = review;
    await this.imagesRepository.save(image);
  }

  async insertVideoOnReview(id: string, review: ReviewEntity) {
    const video = await this.videosRepository
      .createQueryBuilder("video")
      .where("video.id = :id", { id })
      .getOne();

    video.Review = review;
    await this.videosRepository.save(video);
  }
}
