import { ProductEntity } from "src/model/product/entities/product.entity";
import { CreateReviewDto } from "./../dto/create-review.dto";
import { ReviewEntity } from "../entities/review.entity";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "src/model/user/entities/user.entity";

@Injectable()
export class ReviewRepository {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
  ) {}

  async createReviewWithoutMedia(
    createReviewDto: CreateReviewDto,
    user: UserEntity,
    product: ProductEntity,
  ) {
    return await this.reviewRepository.save({
      ...createReviewDto,
      productId: product,
      commenterId: user,
    });
  }

  async findReviewWithReviewer(reviewer: UserEntity) {
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
