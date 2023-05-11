import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ClientUserEntity } from "src/model/user/entities/client-user.entity";
import { Repository } from "typeorm";
import { ReviewEntity } from "../entities/review.entity";
import { ErrorHandlerProps } from "src/common/classes/abstract/error-handler-props";
import { TypeOrmErrorHandlerBuilder } from "src/common/lib/error-handler/typeorm-error-handler.builder";
import { ReviewErrorCase } from "../error/review-error.case";

@Injectable()
export class ReviewInsertRepository extends ErrorHandlerProps {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
    private readonly typeOrmErrorHandlerBuilder: TypeOrmErrorHandlerBuilder,
  ) {
    super();
  }

  async findOneReviewById(id: string): Promise<ReviewEntity> {
    try {
      return await this.reviewRepository
        .createQueryBuilder()
        .select("review")
        .from(ReviewEntity, "review")
        .where("review.id = :id", { id })
        .getOneOrFail();
    } catch (err) {
      this.methodName = this.findOneReviewById.name;
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(ReviewErrorCase)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .handle();
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
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(ReviewErrorCase)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .handle();
    }
  }
}
