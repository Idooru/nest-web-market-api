import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RepositoryLogger } from "src/common/classes/repository.logger";
import { InquiryEntity } from "src/model/inquiry/entities/inquiry.entity";
import { ProductEntity } from "src/model/product/entities/product.entity";
import { ReviewEntity } from "src/model/review/entities/review.entity";
import { Repository } from "typeorm";
import { InquiryImageEntity } from "../entities/inquiry.image.entity";
import { InquiryVideoEntity } from "../entities/inquiry.video.entity";
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
    @InjectRepository(InquiryImageEntity)
    private readonly inquiryImageRepository: Repository<InquiryImageEntity>,
    @InjectRepository(InquiryVideoEntity)
    private readonly inquiryVideoRepository: Repository<InquiryVideoEntity>,
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

  async insertInquiryIdOnInquiryImage(
    inquiryImage: InquiryImageEntity,
    inquiry: InquiryEntity,
  ): Promise<void> {
    try {
      await this.inquiryImageRepository
        .createQueryBuilder()
        .update(InquiryImageEntity)
        .set({ Inquiry: inquiry })
        .where("id = :id", { id: inquiryImage.id })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async insertInquiryIdOnInquiryVideo(
    video: InquiryVideoEntity,
    inquiry: InquiryEntity,
  ): Promise<void> {
    try {
      await this.inquiryVideoRepository
        .createQueryBuilder()
        .update(InquiryVideoEntity)
        .set({ Inquiry: inquiry })
        .where("id = :id", { id: video })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }
}
