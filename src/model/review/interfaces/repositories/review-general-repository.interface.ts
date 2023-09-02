import { InsertResult } from "typeorm";
import { CreateReviewDao } from "../../dto/create-review.dto";
import { ReviewEntity } from "../../entities/review.entity";
import { ModifyReviewDto } from "../../dto/modify-review.dto";

export interface IReviewGeneralRepository {
  findReviewById(id: string): Promise<ReviewEntity>;
  findAllClientsReviews(id: string): Promise<ReviewEntity[]>;
  createReview(createReviewDao: CreateReviewDao): Promise<InsertResult>;
  modifyReview(modifyReviewDto: ModifyReviewDto): Promise<void>;
  deleteReview(review: ReviewEntity): Promise<void>;
}
