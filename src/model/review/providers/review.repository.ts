import { ReviewEntity } from "../entities/review.entity";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserActivityEntity } from "src/model/user/entities/user.activity.entity";
import { ModifyReviewDao } from "../dto/modify-review.dto";
import { CreateReviewDao } from "./../dto/create-review.dto";

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
    createReviewDao: CreateReviewDao,
  ): Promise<ReviewEntity> {
    const { createReviewDto, user, product } = createReviewDao;

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
    createReviewDao: CreateReviewDao,
  ): Promise<ReviewEntity> {
    const { createReviewDto, user, product } = createReviewDao;

    const review = this.reviewRepository.create();

    review.reviews = createReviewDto.reviews;
    review.userSelectScore = createReviewDto.userSelectScore;
    review.Image = createReviewDto.Image;
    review.Product = product;
    review.UserActivity = user.Activity;

    return await this.reviewRepository.save(review);
  }

  async createReviewWithVideo(
    createReviewDao: CreateReviewDao,
  ): Promise<ReviewEntity> {
    const { createReviewDto, user, product } = createReviewDao;

    const review = this.reviewRepository.create();

    review.reviews = createReviewDto.reviews;
    review.userSelectScore = createReviewDto.userSelectScore;
    review.Video = createReviewDto.Video;
    review.Product = product;
    review.UserActivity = user.Activity;

    return await this.reviewRepository.save(review);
  }

  async createReviewWithoutMedia(
    createReviewDao: CreateReviewDao,
  ): Promise<ReviewEntity> {
    const { createReviewDto, user, product } = createReviewDao;

    const review = this.reviewRepository.create();

    review.reviews = createReviewDto.reviews;
    review.userSelectScore = createReviewDto.userSelectScore;
    review.Product = product;
    review.UserActivity = user.Activity;

    return await this.reviewRepository.save(review);
  }

  async modifyReviewWithImageAndVideo(
    modifyReviewDao: ModifyReviewDao,
  ): Promise<void> {
    const { modifyReviewDto, review } = modifyReviewDao;

    review.reviews = modifyReviewDto.reviews;
    review.userSelectScore = modifyReviewDto.userSelectScore;
    review.Image = modifyReviewDto.Image;
    review.Video = modifyReviewDto.Video;

    await this, this.reviewRepository.save(review);
  }

  async modifyReviewWithImage(modifyReviewDao: ModifyReviewDao): Promise<void> {
    const { modifyReviewDto, review } = modifyReviewDao;

    review.reviews = modifyReviewDto.reviews;
    review.userSelectScore = modifyReviewDto.userSelectScore;
    review.Image = modifyReviewDto.Image;

    await this.reviewRepository.save(review);
  }

  async modifyReviewWithVideo(modifyReviewDao: ModifyReviewDao): Promise<void> {
    const { modifyReviewDto, review } = modifyReviewDao;

    review.reviews = modifyReviewDto.reviews;
    review.userSelectScore = modifyReviewDto.userSelectScore;
    review.Video = modifyReviewDto.Video;

    await this.reviewRepository.save(review);
  }

  async modifyReviewWithoutMedia(
    modifyReviewDao: ModifyReviewDao,
  ): Promise<void> {
    const { modifyReviewDto, review } = modifyReviewDao;

    review.reviews = modifyReviewDto.reviews;
    review.userSelectScore = modifyReviewDto.userSelectScore;

    await this.reviewRepository.save(review);
  }
}
