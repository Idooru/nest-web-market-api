import { ReviewEntity } from "../entities/review.entity";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserActivityEntity } from "src/model/user/entities/user.activity.entity";
import { ModifyReviewDao } from "../dto/modify-review.dto";
import { CreateReviewDao } from "../dto/create-review.dto";
import { InternalServerErrorException } from "@nestjs/common/exceptions";

@Injectable()
export class ReviewGeneralRepository {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
  ) {}

  private readonly logger = new Logger("Repository");

  async findAllReviewsWithUserActivity(
    activity: UserActivityEntity,
  ): Promise<ReviewEntity[]> {
    try {
      const reviews = await this.reviewRepository
        .createQueryBuilder()
        .select("review")
        .from(ReviewEntity, "review")
        .innerJoin("review.Product", "Product")
        .innerJoin("review.UserActivity", "Activity")
        .where("activity.id = :id", { id: activity.id })
        .getMany();

      console.log(reviews[0]);

      if (!reviews.length) {
        // 만약 리뷰를 하나도 작성하지 않은 사용자가 다른 사용자의 리뷰를 수정하려고 시도할시 아래 예외가 발생한다.
        throw new NotFoundException(
          `activityId(${activity.id})로 작성된 리뷰가 없습니다.`,
        );
      }

      return reviews;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
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

  async createReview(createReviewDao: CreateReviewDao): Promise<void> {
    try {
      const { createReviewDto, user, product } = createReviewDao;
      await this.reviewRepository
        .createQueryBuilder()
        .insert()
        .into(ReviewEntity)
        .values({
          ...createReviewDto,
          Product: product,
          UserActivity: user.Activity,
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

  async insertReviewIdOnUserActivity(
    userActivity: UserActivityEntity,
    review: ReviewEntity,
  ): Promise<void> {
    try {
      await this.reviewRepository
        .createQueryBuilder()
        .update(ReviewEntity)
        .set({ UserActivity: userActivity })
        .where("id = :id", { id: review.id })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }
}
