import { MediaUploadDto } from "../dto/media-upload.dto";
import { MediaReturnDto } from "../dto/media-return.dto";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductImageEntity } from "../entities/product.image.entity";
import { ReviewImageEntity } from "../entities/review.image.entity";
import { ReviewVideoEntity } from "../entities/review.video.entity";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { InquiryImageEntity } from "src/model/inquiry/entities/inquiry.image.entity";
import { InquiryVideoEntity } from "src/model/inquiry/entities/inquiry.video.entity";
import { ReviewEntity } from "src/model/review/entities/review.entity";
import { ProductEntity } from "src/model/product/entities/product.entity";

@Injectable()
export class UploadRepository {
  constructor(
    @InjectRepository(ProductImageEntity)
    private readonly productsImageRepository: Repository<ProductImageEntity>,
    @InjectRepository(ReviewImageEntity)
    private readonly reviewsImageRepository: Repository<ReviewImageEntity>,
    @InjectRepository(ReviewVideoEntity)
    private readonly reviewsVideoRepository: Repository<ReviewVideoEntity>,
    @InjectRepository(InquiryImageEntity)
    private readonly inquiryImageRepository: Repository<InquiryImageEntity>,
    @InjectRepository(InquiryVideoEntity)
    private readonly inquiryVideoRepository: Repository<InquiryVideoEntity>,
    private readonly configService: ConfigService,
  ) {}

  async uploadProductImage(
    mediaUploadDto: MediaUploadDto,
  ): Promise<MediaReturnDto> {
    const { media, uploader } = mediaUploadDto;
    const fileNameOnUrl = `http://localhost:${this.configService.get(
      "PORT",
    )}/media/${media}`.toLowerCase();

    await this.productsImageRepository.save({
      url: fileNameOnUrl,
      uploader,
    });

    return { name: media, url: fileNameOnUrl };
  }

  async uploadReviewImage(
    mediaUploadDto: MediaUploadDto,
  ): Promise<MediaReturnDto> {
    const { media, uploader } = mediaUploadDto;
    const fileNameOnUrl = `http://localhost:${new ConfigService().get(
      "PORT",
    )}/media/${media}`.toLowerCase();

    await this.reviewsImageRepository.save({
      url: fileNameOnUrl,
      uploader,
    });

    return { name: media, url: fileNameOnUrl };
  }

  async uploadReviewVideo(
    mediaUploadDto: MediaUploadDto,
  ): Promise<MediaReturnDto> {
    const { media, uploader } = mediaUploadDto;
    const fileNameOnUrl = `http://localhost:${new ConfigService().get(
      "PORT",
    )}/media/${media}`.toLowerCase();

    await this.reviewsVideoRepository.save({
      url: fileNameOnUrl,
      uploader,
    });

    return { name: media, url: fileNameOnUrl };
  }

  async uploadInquiryImage(
    mediaUploadDto: MediaUploadDto,
  ): Promise<MediaReturnDto> {
    const { media, uploader } = mediaUploadDto;
    const fileNameOnUrl = `http://localhost:${new ConfigService().get(
      "PORT",
    )}/media/${media}`.toLowerCase();

    await this.inquiryImageRepository.save({
      url: fileNameOnUrl,
      uploader,
    });

    return { name: media, url: fileNameOnUrl };
  }

  async uploadInquiryVideo(
    mediaUploadDto: MediaUploadDto,
  ): Promise<MediaReturnDto> {
    const { media, uploader } = mediaUploadDto;
    const fileNameOnUrl = `http://localhost:${new ConfigService().get(
      "PORT",
    )}/media/${media}`.toLowerCase();

    await this.inquiryVideoRepository.save({
      url: fileNameOnUrl,
      uploader,
    });

    return { name: media, url: fileNameOnUrl };
  }

  async findProductImageWithUrl(url: string): Promise<ProductImageEntity> {
    try {
      return await this.productsImageRepository
        .createQueryBuilder("image")
        .where("image.url = :url", { url })
        .getOneOrFail();
    } catch (err) {
      throw new NotFoundException(
        "해당 url을 가진 상품 이미지를 찾을 수 없습니다.",
      );
    }
  }

  async findProductImageWithProductId(
    productId: string,
  ): Promise<ProductImageEntity> {
    try {
      return await this.productsImageRepository
        .createQueryBuilder()
        .where("productId = :productId", { productId })
        .getOneOrFail();
    } catch (err) {
      throw new NotFoundException(
        "해당 상품아이디와 관계가 맺어진 상품 이미지를 찾을 수 없습니다.",
      );
    }
  }

  async findReviewImageWithUrl(url: string): Promise<ReviewImageEntity> {
    try {
      return await this.reviewsImageRepository
        .createQueryBuilder("image")
        .where("image.url = :url", { url })
        .getOneOrFail();
    } catch (err) {
      throw new NotFoundException(
        "해당 url을 가진 리뷰 이미지를 찾을 수 없습니다.",
      );
    }
  }

  async findReviewVideoWithUrl(url: string): Promise<ReviewVideoEntity> {
    try {
      return await this.reviewsVideoRepository
        .createQueryBuilder("video")
        .where("video.url = :url", { url })
        .getOneOrFail();
    } catch (err) {
      throw new NotFoundException(
        "해당 url을 가진 리뷰 동영상을 찾을 수 없습니다.",
      );
    }
  }

  async findInquiryImageWithUrl(url: string): Promise<InquiryImageEntity> {
    try {
      return await this.inquiryImageRepository
        .createQueryBuilder("image")
        .where("image.url = :url", { url })
        .getOneOrFail();
    } catch (err) {
      throw new NotFoundException(
        "해당 url을 가진 문의 이미지를 찾을 수 없습니다.",
      );
    }
  }

  async findInquiryVideoWithUrl(url: string): Promise<InquiryVideoEntity> {
    try {
      return await this.inquiryVideoRepository
        .createQueryBuilder("video")
        .where("video.url = :url", { url })
        .getOneOrFail();
    } catch (err) {
      throw new NotFoundException(
        "해당 url을 가진 문의 동영상을 찾을 수 없습니다.",
      );
    }
  }

  async deleteProductImageWithId(id: string): Promise<void> {
    await this.productsImageRepository.delete(id);
  }

  async deleteReviewImageWithId(id: string): Promise<void> {
    await this.reviewsImageRepository.delete(id);
  }

  async deleteReviewVideoWithId(id: string): Promise<void> {
    await this.reviewsVideoRepository.delete(id);
  }

  async deleteInquiryImageWithId(id: string): Promise<void> {
    await this.inquiryImageRepository.delete(id);
  }

  async deleteInquiryVideoWithId(id: string): Promise<void> {
    await this.reviewsVideoRepository.delete(id);
  }

  async insertImageOnReview(id: string, review: ReviewEntity) {
    const image = await this.reviewsImageRepository
      .createQueryBuilder("image")
      .where("image.id = :id", { id })
      .getOne();

    image.Review = review;
    await this.reviewsImageRepository.save(image);
  }

  async insertVideoOnReview(id: string, review: ReviewEntity) {
    const video = await this.reviewsVideoRepository
      .createQueryBuilder("video")
      .where("video.id = :id", { id })
      .getOne();

    video.Review = review;
    await this.reviewsVideoRepository.save(video);
  }
}
