import { ReviewEntity } from "../entities/review.entity";
import { ReviewBodyDto } from "./review-body.dto";
import { MediaCookieDto } from "../../media/dto/media-cookie.dto";

export class PrepareToModifyReviewDto {
  reviewBodyDto: ReviewBodyDto;
  userId: string;
  productId: string;
  reviewId: string;
  reviewImgCookies: MediaCookieDto[];
  reviewVdoCookies: MediaCookieDto[];
}

export class ModifyReviewDto {
  reviewBodyDto: ReviewBodyDto;
  review: ReviewEntity;
}
