import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductImageEntity } from "../entities/product-image.entity";
import { Repository } from "typeorm";
import { InquiryResponseImageEntity } from "../entities/inquiry-response-image.entity";
import { MediaSelectProperty } from "../../../common/config/repository-select-configs/media.select";
import { ReviewImageEntity } from "../entities/review-image.entity";
import { ReviewVideoEntity } from "../entities/review-video.entity";
import { InquiryRequestImageEntity } from "../entities/inquiry-request-image.entity";
import { InquiryRequestVideoEntity } from "../entities/inquiry-request-video.entity";
import { InquiryResponseVideoEntity } from "../entities/inquiry-response-video.entity";

@Injectable()
export class MediaSearchRepository {
  constructor(
    @InjectRepository(ProductImageEntity)
    private readonly productImageRepository: Repository<ProductImageEntity>,
    @InjectRepository(ReviewImageEntity)
    private readonly reviewImageRepository: Repository<ReviewImageEntity>,
    @InjectRepository(ReviewVideoEntity)
    private readonly reviewVideoRepository: Repository<ReviewVideoEntity>,
    @InjectRepository(InquiryRequestImageEntity)
    private readonly inquiryRequestImageRepository: Repository<InquiryRequestImageEntity>,
    @InjectRepository(InquiryRequestVideoEntity)
    private readonly inquiryRequestVideoRepository: Repository<InquiryRequestVideoEntity>,
    @InjectRepository(InquiryResponseImageEntity)
    private readonly inquiryResponseImageRepository: Repository<InquiryResponseImageEntity>,
    @InjectRepository(InquiryResponseVideoEntity)
    private readonly inquiryResponseVideoRepository: Repository<InquiryResponseVideoEntity>,
    @Inject("MediaSelectProperty")
    private readonly mediaSelect: MediaSelectProperty,
  ) {}

  public findProductImageWithId(id: string): Promise<ProductImageEntity> {
    return this.productImageRepository
      .createQueryBuilder()
      .select(this.mediaSelect.productImages)
      .from(ProductImageEntity, "productImage")
      .where("productImage.id = :id", { id })
      .getOne();
  }

  public findBeforeProductImagesWithId(
    id: string,
  ): Promise<ProductImageEntity[]> {
    return this.productImageRepository
      .createQueryBuilder()
      .select(this.mediaSelect.productImages)
      .from(ProductImageEntity, "productImage")
      .where("productImage.productId = :productId", { productId: id })
      .getMany();
  }

  public findReviewImageWithId(id: string): Promise<ReviewImageEntity> {
    return this.reviewImageRepository
      .createQueryBuilder()
      .select(this.mediaSelect.reviewImages)
      .from(ReviewImageEntity, "reviewImage")
      .where("reviewImage.id = :id", { id })
      .getOne();
  }

  public findBeforeReviewImagesWithId(
    id: string,
  ): Promise<ReviewImageEntity[]> {
    return this.reviewImageRepository
      .createQueryBuilder()
      .select(this.mediaSelect.reviewImages)
      .from(ReviewImageEntity, "reviewImage")
      .where("reviewImage.reviewId = :reviewId", { reviewId: id })
      .getMany();
  }

  public findReviewVideoWithId(id: string): Promise<ReviewVideoEntity> {
    return this.reviewVideoRepository
      .createQueryBuilder()
      .select(this.mediaSelect.reviewVideos)
      .from(ReviewVideoEntity, "reviewVideo")
      .where("reviewVideo.id = :id", { id })
      .getOne();
  }

  public findBeforeReviewVideosWithId(
    id: string,
  ): Promise<ReviewVideoEntity[]> {
    return this.reviewVideoRepository
      .createQueryBuilder()
      .select(this.mediaSelect.reviewVideos)
      .from(ReviewVideoEntity, "reviewVideo")
      .where("reviewVideo.reviewId = :reviewId", { reviewId: id })
      .getMany();
  }

  public findInquiryRequestImageWithId(
    id: string,
  ): Promise<InquiryRequestImageEntity> {
    return this.inquiryRequestImageRepository
      .createQueryBuilder()
      .select(this.mediaSelect.inquiryRequestImages)
      .from(InquiryRequestImageEntity, "inquiryRequestImage")
      .where("inquiryRequestImage.id = :id", { id })
      .getOne();
  }

  public findInquiryRequestVideoWithId(
    id: string,
  ): Promise<InquiryRequestVideoEntity> {
    return this.inquiryRequestVideoRepository
      .createQueryBuilder()
      .select(this.mediaSelect.inquiryRequestVideos)
      .from(InquiryRequestVideoEntity, "inquiryRequestVideo")
      .where("inquiryRequestVideo.id = :id", { id })
      .getOne();
  }

  public findInquiryResponseImageWithId(
    id: string,
  ): Promise<InquiryResponseImageEntity> {
    return this.inquiryResponseImageRepository
      .createQueryBuilder()
      .select(this.mediaSelect.inquiryResponseImages)
      .from(InquiryResponseImageEntity, "inquiryResponseImage")
      .where("inquiryResponseImage.id = :id", { id })
      .getOne();
  }

  public findInquiryResponseVideoWithId(
    id: string,
  ): Promise<InquiryResponseVideoEntity> {
    return this.inquiryResponseVideoRepository
      .createQueryBuilder()
      .select(this.mediaSelect.inquiryResponseVideos)
      .from(InquiryResponseVideoEntity, "inquiryResponseVideo")
      .where("inquiryResponseVideo.id = :id", { id })
      .getOne();
  }
}
