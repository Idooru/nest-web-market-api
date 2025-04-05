import { ReviewBody } from "./review-body.dto";
import { ReviewEntity } from "../../entities/review.entity";
import { MediaCookieDto } from "../../../media/dto/request/media-cookie.dto";

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
