import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RepositoryLayerErrorHandleLibrary } from "src/common/lib/error-handler/repository-error-handler.library";
import { ClientUserEntity } from "src/model/user/entities/client-user.entity";
import { Repository } from "typeorm";
import { ReviewEntity } from "../entities/review.entity";
import { ErrorHandlerProps } from "src/common/classes/error-handler-props";

@Injectable()
export class ReviewInsertRepository extends ErrorHandlerProps {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
    private readonly repositoryErrorHandler: RepositoryLayerErrorHandleLibrary,
  ) {
    super();
  }

  async findLastCreatedReview(): Promise<ReviewEntity> {
    try {
      return await this.reviewRepository
        .createQueryBuilder()
        .select("review")
        .from(ReviewEntity, "review")
        .orderBy("review.createdAt", "DESC")
        .limit(1)
        .getOne();
    } catch (err) {
      this.methodName = this.findLastCreatedReview.name;
      this.repositoryErrorHandler.init<ReviewEntity>(
        new ReviewEntity(),
        this.className,
        this.methodName,
        err,
      );
    }
  }

  async insertReviewIdOnClientUser(
    clientUser: ClientUserEntity,
    review: ReviewEntity,
  ): Promise<void> {
    try {
      await this.reviewRepository
        .createQueryBuilder()
        .update(ReviewEntity)
        .set({ reviewer: clientUser })
        .where("id = :id", { id: review.id })
        .execute();
    } catch (err) {
      this.methodName = this.insertReviewIdOnClientUser.name;
      this.repositoryErrorHandler.init<ReviewEntity>(
        new ReviewEntity(),
        this.className,
        this.methodName,
        err,
      );
    }
  }
}
