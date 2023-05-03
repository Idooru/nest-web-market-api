import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { InquiryRequestEntity } from "src/model/inquiry/entities/inquiry-request.entity";
import { InquiryResponseEntity } from "src/model/inquiry/entities/inquiry-response.entity";
import { ProductEntity } from "src/model/product/entities/product.entity";
import { ReviewEntity } from "src/model/review/entities/review.entity";
import { EntityTarget, Repository } from "typeorm";
import { InquiryRequestImageEntity } from "../entities/inquiry-request-image.entity";
import { InquiryRequestVideoEntity } from "../entities/inquiry-request-video.entity";
import { InquiryResponseImageEntity } from "../entities/inquiry-response-image.entity";
import { InquiryResponseVideoEntity } from "../entities/inquiry-response-video.entity";
import { ProductImageEntity } from "../entities/product.image.entity";
import { ReviewImageEntity } from "../entities/review.image.entity";
import { ReviewVideoEntity } from "../entities/review.video.entity";
import { ErrorHandlerProps } from "src/common/classes/error-handler-props";
import { ErrorHandlerBuilder } from "src/common/lib/error-handler/error-hanlder-builder";

@Injectable()
export class MediaInsertRepository extends ErrorHandlerProps {
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
    private readonly errorHandlerBuilder: ErrorHandlerBuilder,
  ) {
    super();
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
      this.methodName = this.insertProductIdOnProductImage.name;
      this.errorHandlerBuilder
        .setEntity(ProductImageEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
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
      this.methodName = this.insertReviewIdOnReviewImage.name;
      this.errorHandlerBuilder
        .setEntity(ReviewImageEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
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
      this.methodName = this.insertReviewIdOnReviewVideo.name;
      this.errorHandlerBuilder
        .setEntity(ReviewVideoEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
    }
  }

  async insertInquiryRequestIdOnInquiryRequestImage(
    inquiryRequestImage: InquiryRequestImageEntity,
    inquiryRequest: InquiryRequestEntity,
  ): Promise<void> {
    try {
      await this.inquiryRequestImageRepository
        .createQueryBuilder()
        .update(InquiryRequestImageEntity)
        .set({ InquiryRequest: inquiryRequest })
        .where("id = :id", { id: inquiryRequestImage.id })
        .execute();
    } catch (err) {
      this.methodName = this.insertInquiryRequestIdOnInquiryRequestImage.name;
      this.errorHandlerBuilder
        .setEntity(InquiryRequestImageEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
    }
  }

  async insertInquiryResponseIdOnInquiryResponseImage(
    inquiryResponseImage: InquiryResponseImageEntity,
    inquiryResponse: InquiryResponseEntity,
  ): Promise<void> {
    try {
      await this.inquiryResponseImageRepository
        .createQueryBuilder()
        .update(InquiryResponseImageEntity)
        .set({ InquiryResponse: inquiryResponse })
        .where("id = :id", { id: inquiryResponseImage.id })
        .execute();
    } catch (err) {
      this.methodName = this.insertInquiryResponseIdOnInquiryResponseImage.name;
      this.errorHandlerBuilder
        .setEntity(InquiryResponseImageEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
    }
  }

  async insertInquiryRequestIdOnInquiryRequestVideo(
    inquiryRequestVideo: InquiryRequestVideoEntity,
    inquiryRequest: InquiryRequestEntity,
  ): Promise<void> {
    try {
      await this.inquiryRequestVideoRepository
        .createQueryBuilder()
        .update(InquiryRequestVideoEntity)
        .set({ InquiryRequest: inquiryRequest })
        .where("id = :id", { id: inquiryRequestVideo.id })
        .execute();
    } catch (err) {
      this.methodName = this.insertInquiryRequestIdOnInquiryRequestVideo.name;
      this.errorHandlerBuilder
        .setEntity(InquiryRequestVideoEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
    }
  }

  async insertInquiryResponseIdOnInquiryResponseVideo(
    inquiryResponseVideo: InquiryResponseVideoEntity,
    inquiryResponse: InquiryResponseEntity,
  ): Promise<void> {
    try {
      await this.inquiryResponseVideoRepository
        .createQueryBuilder()
        .update(InquiryResponseVideoEntity)
        .set({ InquiryResponse: inquiryResponse })
        .where("id = :id", { id: inquiryResponseVideo.id })
        .execute();
    } catch (err) {
      this.methodName = this.insertInquiryResponseIdOnInquiryResponseVideo.name;
      this.errorHandlerBuilder
        .setEntity(InquiryResponseVideoEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
    }
  }
}
