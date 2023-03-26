import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RepositoryLogger } from "src/common/classes/repository.logger";
import { InquiryRequestEntity } from "src/model/inquiry/entities/inquiry-request.entity";
import { ProductEntity } from "src/model/product/entities/product.entity";
import { ReviewEntity } from "src/model/review/entities/review.entity";
import { Repository } from "typeorm";
import { InquiryRequestImageEntity } from "../entities/inquiry-request-image.entity";
import { InquiryRequestVideoEntity } from "../entities/inquiry-request-video.entity";
import { ProductImageEntity } from "../entities/product.image.entity";
import { ReviewImageEntity } from "../entities/review.image.entity";
import { ReviewVideoEntity } from "../entities/review.video.entity";

@Injectable()
export class MediaInsertRepository extends RepositoryLogger {
  constructor(
    @InjectRepository(ProductImageEntity)
    private readonly productImageRepository: Repository<ProductImageEntity>,
    @InjectRepository(ReviewImageEntity)
    private readonly reviewImageRepository: Repository<ReviewImageEntity>,
    @InjectRepository(ReviewVideoEntity)
    private readonly reviewVideoRepository: Repository<ReviewVideoEntity>,
    @InjectRepository(InquiryRequestImageEntity)
    private readonly inquiryImageRepository: Repository<InquiryRequestImageEntity>,
    @InjectRepository(InquiryRequestVideoEntity)
    private readonly inquiryVideoRepository: Repository<InquiryRequestVideoEntity>,
  ) {
    super("Media Insert");
  }

  async insertProductIdOnProductImage(
    productImage: ProductImageEntity,
    product: ProductEntity,
  ): Promise<void> {
    try {
      await this.productImageRepository
        .createQueryBuilder()
        .update(ProductImageEntity)
        .set({ Product: product })
        .where("id = :id", { id: productImage.id })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async insertReviewIdOnReviewImage(
    reviewImage: ReviewImageEntity,
    review: ReviewEntity,
  ): Promise<void> {
    try {
      await this.reviewImageRepository
        .createQueryBuilder()
        .update(ReviewImageEntity)
        .set({ Review: review })
        .where("id = :id", { id: reviewImage.id })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async insertReviewIdOnReviewVideo(
    reviewVideo: ReviewVideoEntity,
    review: ReviewEntity,
  ): Promise<void> {
    try {
      await this.reviewVideoRepository
        .createQueryBuilder()
        .update(ReviewVideoEntity)
        .set({ Review: review })
        .where("id = :id", { id: reviewVideo.id })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async insertInquiryRequestIdOnInquiryRequestImage(
    inquiryImage: InquiryRequestImageEntity,
    inquiry: InquiryRequestEntity,
  ): Promise<void> {
    try {
      await this.inquiryImageRepository
        .createQueryBuilder()
        .update(InquiryRequestImageEntity)
        .set({ Inquiry: inquiry })
        .where("id = :id", { id: inquiryImage.id })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async insertInquiryRequestIdOnInquiryRequestVideo(
    inquiryVideo: InquiryRequestVideoEntity,
    inquiry: InquiryRequestEntity,
  ): Promise<void> {
    try {
      await this.inquiryVideoRepository
        .createQueryBuilder()
        .update(InquiryRequestVideoEntity)
        .set({ Inquiry: inquiry })
        .where("id = :id", { id: inquiryVideo.id })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }
}
