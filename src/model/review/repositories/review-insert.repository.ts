import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ClientUserEntity } from "src/model/user/entities/client-user.entity";
import { EntityTarget, Repository } from "typeorm";
import { ReviewEntity } from "../entities/review.entity";
import { ErrorHandlerProps } from "src/common/classes/error-handler-props";
import { ErrorHandlerBuilder } from "src/common/lib/error-handler/error-hanlder.builder";

@Injectable()
export class ReviewInsertRepository extends ErrorHandlerProps {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
    private readonly errorHandlerBuilder: ErrorHandlerBuilder,
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
      this.errorHandlerBuilder
        .setEntity(ReviewEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
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
      this.errorHandlerBuilder
        .setEntity(ReviewEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
    }
  }
}
