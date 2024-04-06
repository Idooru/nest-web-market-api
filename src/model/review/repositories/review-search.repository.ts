import { InjectRepository } from "@nestjs/typeorm";
import { ReviewEntity } from "../entities/review.entity";
import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { StarRateEntity } from "../entities/star-rate.entity";
import { ReviewSelectProperty } from "../../../common/config/repository-select-configs/review.select";

@Injectable()
export class ReviewSearchRepository {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
    @InjectRepository(StarRateEntity)
    private readonly starRateRepository: Repository<StarRateEntity>,
    @Inject("ReviewSelectProperty")
    private readonly select: ReviewSelectProperty,
  ) {}

  public findAllClientsReviews(id: string): Promise<ReviewEntity[]> {
    return this.reviewRepository
      .createQueryBuilder()
      .select(this.select.reviews)
      .from(ReviewEntity, "review")
      .innerJoin("review.Product", "Product")
      .innerJoin("review.reviewer", "Client")
      .leftJoin("review.Image", "Image")
      .leftJoin("review.Video", "Video")
      .where("Client.id = :id", { id })
      .getMany();
  }

  public findStarRateWithId(id: string): Promise<StarRateEntity> {
    return this.starRateRepository
      .createQueryBuilder()
      .select(this.select.starRate)
      .from(StarRateEntity, "starRate")
      .where("starRate.id = :id", { id })
      .getOne();
  }

  public findReviewWithId(id: string): Promise<ReviewEntity> {
    return this.reviewRepository
      .createQueryBuilder()
      .select(this.select.review)
      .from(ReviewEntity, "review")
      .innerJoin("review.Product", "Product")
      .innerJoin("review.reviewer", "Client")
      .leftJoin("review.Image", "Image")
      .leftJoin("review.Video", "Video")
      .where("review.id = :id", { id })
      .getOne();
  }
}
