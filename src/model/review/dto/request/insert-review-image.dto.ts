import { ReviewImageEntity } from "../../../media/entities/review-image.entity";

export class InsertReviewImagesDto {
  reviewId: string;
  reviewImages: ReviewImageEntity[];
}

export class InsertReviewImageDto {
  reviewId: string;
  reviewImageId: string;
}
