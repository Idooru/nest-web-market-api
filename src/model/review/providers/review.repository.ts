import { ProductEntity } from "src/model/product/entities/product.entity";
import { CreateReviewDto } from "./../dto/create-review.dto";
import { ReviewEntity } from "../entities/review.entity";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "src/model/user/entities/user.entity";
import { UserActivityEntity } from "src/model/user/entities/user.activity.entity";
import { ModifyReviewDto } from "../dto/modify-review.dto";

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
      .leftJoinAndSelect("review.UserActivity", "activity")
      .where("activity.id = :id", { id: activity.id })
      .getMany();

    if (!reviews.length) {
      throw new NotFoundException(`${activity.id}로 작성된 리뷰가 없습니다.`);
    }

    return reviews;
  }

  async findReviewWithUserActivity(reviewer: UserActivityEntity) {
    try {
      return await this.reviewRepository
        .createQueryBuilder()
        .where("reviewer = :reviewer", { reviewer })
        .getOneOrFail();
    } catch (err) {
      throw new NotFoundException("해당 리뷰어를 찾을 수 없습니다.");
    }
  }

  async createReviewSample(): Promise<ReviewEntity[]> {
    const review = this.reviewRepository.create();
    return [await this.reviewRepository.save(review)];
  }

  async createReviewWithImageAndVideo(
    createReviewDto: CreateReviewDto,
    user: UserEntity,
    product: ProductEntity,
  ) {
    const review = this.reviewRepository.create();

    review.reviews = createReviewDto.reviews;
    review.userSelectScore = createReviewDto.userSelectScore;
    review.Image = createReviewDto.Image;
    review.Video = createReviewDto.Video;
    review.Product = product;
    review.UserActivity = user.Activity;

    return await this.reviewRepository.save(review);
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

  async createReviewWithoutMedia(
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

  async modifyReviewWithoutMedia(
    modifyReviewDto: ModifyReviewDto,
    review: ReviewEntity,
  ): Promise<void> {
    review.reviews = modifyReviewDto.reviews;
    review.userSelectScore = modifyReviewDto.userSelectScore;

    await this.reviewRepository.save(review);
  }
}
