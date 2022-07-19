import { ProductsEntity } from "src/model/product/entities/product.entity";
import { CreateReviewDto } from "./../dto/create-review.dto";
import { ReviewsEntity } from "../entities/review.entity";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersEntity } from "src/model/user/entities/user.entity";

@Injectable()
export class ReviewRepository {
  constructor(
    @InjectRepository(ReviewsEntity)
    private readonly reviewRepository: Repository<ReviewsEntity>,
  ) {}

  async createReviewSample(): Promise<ReviewsEntity[]> {
    const review = this.reviewRepository.create();
    return [await this.reviewRepository.save(review)];
  }

  async createReview(
    createReviewDto: CreateReviewDto,
    user: UsersEntity,
    product: ProductsEntity,
  ): Promise<ReviewsEntity> {
    const review = this.reviewRepository.create();

    review.reviews = createReviewDto.reviews;
    review.userSelectScore = createReviewDto.userSelectScore;
    review.Product = product;
    review.Reviewer = user;

    return await this.reviewRepository.save(review);
  }

  async findReviewWithReviewer(reviewer: UsersEntity) {
    try {
      return await this.reviewRepository
        .createQueryBuilder("review")
        .where("review.reviewer = :reviewer", { reviewer })
        .getOneOrFail();
    } catch (err) {
      throw new NotFoundException("해당 리뷰어를 찾을 수 없습니다.");
    }
  }
}
