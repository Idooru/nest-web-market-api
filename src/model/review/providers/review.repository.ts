import { ProductEntity } from "src/model/product/entities/product.entity";
import { CreateReviewDto } from "./../dto/create-review.dto";
import { ReviewEntity } from "../entities/review.entity";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "src/model/user/entities/user.entity";
import { UserActivityEntity } from "src/model/user/entities/user.activity.entity";

@Injectable()
export class ReviewRepository {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
  ) {}

  async findAllReviewsWithUserActivity(
    activity: UserActivityEntity,
  ): Promise<ReviewEntity[]> {
    const reviews = await this.reviewRepository
      .createQueryBuilder("review")
      .select(["UserActivity.id"])
      .leftJoin("review.UserActivity", "activity")
      .where("review.activity = :UserActivity", { UserActivity: activity })
      .getMany();

    if (!reviews.length) {
      throw new NotFoundException(`${activity.id}로 작성된 리뷰가 없습니다.`);
    }

    return reviews;
  }

  async createReviewSample(): Promise<ReviewEntity[]> {
    const review = this.reviewRepository.create();
    return [await this.reviewRepository.save(review)];
  }

  async createReviewWithImage(
    createReviewDto: CreateReviewDto,
    user: UserEntity,
    product: ProductEntity,
  ): Promise<ReviewEntity> {
    const review = this.reviewRepository.create();

    review.reviews = createReviewDto.reviews;
    review.userSelectScore = createReviewDto.userSelectScore;
    review.Image = createReviewDto.Image;
    review.Product = product;
    review.UserActivity = user.Activity;

    return await this.reviewRepository.save(review);
  }

  async createReviewWithVideo(
    createReviewDto: CreateReviewDto,
    user: UserEntity,
    product: ProductEntity,
  ): Promise<ReviewEntity> {
    const review = this.reviewRepository.create();

    review.reviews = createReviewDto.reviews;
    review.userSelectScore = createReviewDto.userSelectScore;
    review.Video = createReviewDto.Video;
    review.Product = product;
    review.UserActivity = user.Activity;

    return await this.reviewRepository.save(review);
  }

  async createReview(
    createReviewDto: CreateReviewDto,
    user: UserEntity,
    product: ProductEntity,
  ): Promise<ReviewEntity> {
    const review = this.reviewRepository.create();
    const Activity = user.Activity;

    review.reviews = createReviewDto.reviews;
    review.userSelectScore = createReviewDto.userSelectScore;
    review.Product = product;
    review.UserActivity = Activity;

    return await this.reviewRepository.save(review);
  }

  async findReviewWithUserActivity(reviewer: UserEntity) {
    try {
      return await this.reviewRepository
        .createQueryBuilder()
        .where("reviewer = :reviewer", { reviewer })
        .getOneOrFail();
    } catch (err) {
      throw new NotFoundException("해당 리뷰어를 찾을 수 없습니다.");
    }
  }
}
