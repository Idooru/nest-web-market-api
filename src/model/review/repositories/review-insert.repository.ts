import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RepositoryLogger } from "src/common/classes/repository.logger";
import { ClientUserEntity } from "src/model/user/entities/client-user.entity";
import { Repository } from "typeorm";
import { ReviewEntity } from "../entities/review.entity";

@Injectable()
export class ReviewInsertRepository extends RepositoryLogger {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
  ) {
    super("Review Insert");
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
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
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
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }
}
