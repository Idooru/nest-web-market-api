import { ReviewEntity } from "../entities/review.entity";
import { ReviewBodyDto } from "./review-body.dto";
import { MediaCookieDto } from "../../media/dto/media-cookie.dto";

class ReviewBasicDto {
  reviewBodyDto: ReviewBodyDto;
  userId: string;
  productId: string;
  reviewId: string;
}

export class ModifyReviewAllMediaDto extends ReviewBasicDto {
  reviewImgCookies: MediaCookieDto[];
  reviewVdoCookies: MediaCookieDto[];
}

export class ModifyReviewImageDto extends ReviewBasicDto {
  reviewImgCookies: MediaCookieDto[];
}

export class ModifyReviewVideoDto extends ReviewBasicDto {
  reviewVdoCookies: MediaCookieDto[];
}

export class ModifyReviewNoMediaDto extends ReviewBasicDto {}

export class ModifyReviewDto {
  reviewBodyDto: ReviewBodyDto;
  review: ReviewEntity;
}
