import { ReviewEntity } from "../../entities/review.entity";

export interface IReviewBundleService {
  checkModifyCount(review: ReviewEntity): void;
  distinguishOwnReview(reviewId: string, userId: string): Promise<ReviewEntity>;
  // pushReviewMedia(pushReviewMediaDto: PushReviewMediaDto): Promise<void>;
  // insertReviewMedia(insertReviewMediaDto: InsertReviewMediaDto): Promise<void>;
  // modifyReviewMedia(modifyReviewMediaDto: ModifyReviewMediaDto): Promise<void>;
  // deleteReviewMedia(review: ReviewEntity): Promise<void>;
}
