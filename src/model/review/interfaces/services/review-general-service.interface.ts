import { CreateReviewDto } from "../../dto/create-review.dto";
import { ModifyReviewDto } from "../../dto/modify-review.dto";
import { ReviewEntity } from "../../entities/review.entity";

export interface IReviewGeneralService {
  findReviewFromProductById(id: string): Promise<ReviewEntity[]>;
  createReview(createReviewDto: CreateReviewDto): Promise<ReviewEntity>;
  modifyReview(modifyReviewDto: ModifyReviewDto): Promise<void>;
  deleteReview(review: ReviewEntity): Promise<void>;
}
