import { ReviewEntity } from "../entities/review.entity";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ModifyReviewDao } from "../dto/modify-review.dto";
import { CreateReviewDao } from "../dto/create-review.dto";
import { InternalServerErrorException } from "@nestjs/common/exceptions";
import { ClientUserEntity } from "src/model/user/entities/client-user.entity";
import { reviewSelectProperty } from "src/common/config/repository-select-configs/review-select";
import { RepositoryLogger } from "src/common/classes/repository.logger";

@Injectable()
export class ReviewGeneralRepository extends RepositoryLogger {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
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
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async createReview(createReviewDao: CreateReviewDao): Promise<void> {
    try {
      const { createReviewDto, client, product } = createReviewDao;
      await this.reviewRepository
        .createQueryBuilder()
        .insert()
        .into(ReviewEntity)
        .values({
          ...createReviewDto,
          Product: product,
          reviewer: client,
        })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async modifyReview(modifyReviewDao: ModifyReviewDao): Promise<void> {
    try {
      const { modifyReviewDto, review } = modifyReviewDao;
      await this.reviewRepository
        .createQueryBuilder()
        .update(ReviewEntity)
        .set({ ...modifyReviewDto })
        .where("id = :id", { id: review.id })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
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
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }
}
