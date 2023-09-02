import { ReviewEntity } from "../entities/review.entity";
import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { InsertResult, Repository } from "typeorm";
import { ModifyReviewDto } from "../dto/modify-review.dto";
import { CreateReviewDao } from "../dto/create-review.dto";
import { ReviewSelectProperty } from "src/common/config/repository-select-configs/review.select";
import { ErrorHandlerProps } from "src/common/classes/abstract/error-handler-props";
import { TypeOrmErrorHandlingBuilder } from "src/common/lib/error-handler/typeorm-error-handling.builder";
import { ReviewErrorHandler } from "../error/review-error.handler";
import { IReviewGeneralRepository } from "../interfaces/repositories/review-general-repository.interface";

@Injectable()
export class ReviewGeneralRepository
  extends ErrorHandlerProps
  implements IReviewGeneralRepository
{
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
    @Inject("ReviewSelectProperty")
    private readonly select: ReviewSelectProperty,
    private readonly typeOrmErrorHandlerBuilder: TypeOrmErrorHandlingBuilder,
  ) {
    super();
  }

  async findReviewById(id: string): Promise<ReviewEntity> {
    try {
      return await this.reviewRepository
        .createQueryBuilder()
        .select(this.select.review)
        .from(ReviewEntity, "review")
        .innerJoin("review.Prodcut", "Product")
        .leftJoin("review.Image", "Image")
        .leftJoin("review.Video", "Video")
        .where("review.id = :id", { id })
        .getOneOrFail();
    } catch (err) {
      this.methodName = this.findAllClientsReviews.name;
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(ReviewErrorHandler)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(id, "id")
        .handle();
    }
  }

  async findAllClientsReviews(id: string): Promise<ReviewEntity[]> {
    try {
      return await this.reviewRepository
        .createQueryBuilder()
        .select(this.select.reviews)
        .from(ReviewEntity, "review")
        .innerJoin("review.Product", "Product")
        .innerJoin("review.reviewer", "Client")
        .leftJoin("review.Image", "Image")
        .leftJoin("review.Video", "Video")
        .where("Client.id = :id", { id })
        .getMany();
    } catch (err) {
      this.methodName = this.findAllClientsReviews.name;
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(ReviewErrorHandler)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(id, "id")
        .handle();
    }
  }

  async createReview(createReviewDao: CreateReviewDao): Promise<InsertResult> {
    try {
      const { reviewRequestDto, client, product } = createReviewDao;
      return await this.reviewRepository
        .createQueryBuilder()
        .insert()
        .into(ReviewEntity)
        .values({
          ...reviewRequestDto,
          Product: product,
          reviewer: client,
        })
        .execute();
    } catch (err) {
      this.methodName = this.createReview.name;
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(ReviewErrorHandler)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .handle();
    }
  }

  async modifyReview(modifyReviewDto: ModifyReviewDto): Promise<void> {
    try {
      const { beforeReview, reviewRequestDto } = modifyReviewDto;
      await this.reviewRepository
        .createQueryBuilder()
        .update(ReviewEntity)
        .set({
          title: reviewRequestDto.title,
          content: reviewRequestDto.content,
          scoreChosenByClient: reviewRequestDto.scoreChosenByClient,
          countForModify: --beforeReview.countForModify,
        })
        .where("id = :id", { id: beforeReview.id })
        .execute();
    } catch (err) {
      this.methodName = this.modifyReview.name;
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(ReviewErrorHandler)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .handle();
    }
  }

  async deleteReview(review: ReviewEntity): Promise<void> {
    try {
      await this.reviewRepository
        .createQueryBuilder()
        .delete()
        .from(ReviewEntity)
        .where("id = :id", { id: review.id })
        .execute();
    } catch (err) {
      this.methodName = this.deleteReview.name;
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(ReviewErrorHandler)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .handle();
    }
  }
}
