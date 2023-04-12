import { ReviewEntity } from "../entities/review.entity";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ModifyReviewDto } from "../dto/modify-review.dto";
import { CreateReviewDao } from "../dto/create-review.dto";
import { ReviewSelectProperty } from "src/common/config/repository-select-configs/review.select";
import { ErrorHandlerProps } from "src/common/classes/error-handler-props";
import { ErrorHandlerBuilder } from "src/common/lib/error-handler/error-hanlder-builder";

@Injectable()
export class ReviewGeneralRepository extends ErrorHandlerProps {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
    @Inject("ReviewSelectProperty")
    private readonly select: ReviewSelectProperty,
    private readonly errorHandlerBuilder: ErrorHandlerBuilder<unknown>,
  ) {
    super();
  }

  async findAllClientsReviews(id: string): Promise<ReviewEntity[]> {
    try {
      const reviews = await this.reviewRepository
        .createQueryBuilder()
        .select(this.select.reviews)
        .from(ReviewEntity, "review")
        .innerJoin("review.Product", "Product")
        .innerJoin("review.reviewer", "Client")
        .leftJoin("review.Image", "Image")
        .leftJoin("review.Video", "Video")
        .where("Client.id = :id", { id })
        .getMany();

      if (!reviews.length) {
        // 만약 리뷰를 하나도 작성하지 않은 사용자가 다른 사용자의 리뷰를 수정하려고 시도할시 아래 예외가 발생한다.
        throw new NotFoundException(
          `고객 사용자의 아이디(${id})로 작성된 리뷰가 없습니다.`,
        );
      }

      return reviews;
    } catch (err) {
      this.methodName = this.findAllClientsReviews.name;
      this.errorHandlerBuilder
        .setEntity(new ReviewEntity())
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(id, "id")
        .setLayer("repository")
        .handle();
    }
  }

  async createReview(createReviewDao: CreateReviewDao): Promise<void> {
    try {
      const { reviewRequestDto, client, product } = createReviewDao;
      await this.reviewRepository
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
      this.errorHandlerBuilder
        .setEntity(new ReviewEntity())
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
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
      this.errorHandlerBuilder
        .setEntity(new ReviewEntity())
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
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
      this.errorHandlerBuilder
        .setEntity(new ReviewEntity())
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
    }
  }
}
