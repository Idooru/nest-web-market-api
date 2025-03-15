import { ReviewEntity } from "../entities/review.entity";
import { ReviewBody } from "./review-body.dto";
import { MediaCookieDto } from "../../media/dto/media-cookie.dto";

export class ModifyReviewDto {
  body: ReviewBody;
  userId: string;
  productId: string;
  reviewId: string;
  reviewImgCookies: MediaCookieDto[];
  reviewVdoCookies: MediaCookieDto[];
}

export class ModifyReviewRowDto {
  review: ReviewEntity;
  body: ReviewBody;
}
