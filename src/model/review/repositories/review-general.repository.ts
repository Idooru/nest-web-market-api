import { ReviewEntity } from "../entities/review.entity";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ModifyReviewDto } from "../dto/modify-review.dto";
import { CreateReviewDao } from "../dto/create-review.dto";
import { reviewSelectProperty } from "src/common/config/repository-select-configs/review-select";
import { RepositoryErrorHandleLibrary } from "src/common/lib/repository-error-handler.library";
import { ErrorHandlerProps } from "src/common/classes/error-handler-props";

@Injectable()
export class ReviewGeneralRepository extends ErrorHandlerProps {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
    private readonly repositoryErrorHandler: RepositoryErrorHandleLibrary,
  ) {
    super();
  }

  private readonly select = reviewSelectProperty;

  async findAllClientsReviews(id: string): Promise<ReviewEntity[]> {
    try {
      const reviews = await this.reviewRepository
        .createQueryBuilder()
        .select(this.select.reviewsSelect)
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
      this.repositoryErrorHandler.init<ReviewEntity>(
        new ReviewEntity(),
        this.className,
        this.methodName,
        err,
        { stuff: id, stuffMean: "아이디" },
      );
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
      this.repositoryErrorHandler.init<ReviewEntity>(
        new ReviewEntity(),
        this.className,
        this.methodName,
        err,
      );
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
      this.repositoryErrorHandler.init<ReviewEntity>(
        new ReviewEntity(),
        this.className,
        this.methodName,
        err,
      );
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
      this.repositoryErrorHandler.init<ReviewEntity>(
        new ReviewEntity(),
        this.className,
        this.methodName,
        err,
      );
    }
  }
}
