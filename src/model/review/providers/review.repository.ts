import { ReviewEntity } from "../entities/review.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class ReviewRepository {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
  ) {}

  // async createReview(createReviewVo: CreateReviewServiceDto) {
  //   console.log(1);
  // }
}