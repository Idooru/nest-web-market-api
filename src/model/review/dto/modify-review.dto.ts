import { CreateReviewDto } from "./create-review.dto";
import { ReviewEntity } from "../entities/review.entity";
import { MediaUrlCookie } from "../../../common/interfaces/media.url.cookie.interface";

export class ModifyReviewDto extends CreateReviewDto {}

export class ModifyReviewWithImageAndVideoDto {
  modifyReviewDto: ModifyReviewDto;
  review: ReviewEntity;
  reviewImgCookie: MediaUrlCookie[];
  reviewVdoCookie: MediaUrlCookie[];
}

export class ModifyReviewWithImageDto {
  modifyReviewDto: ModifyReviewDto;
  review: ReviewEntity;
  reviewImgCookie: MediaUrlCookie[];
}

export class ModifyReviewWithVideoDto {
  modifyReviewDto: ModifyReviewDto;
  review: ReviewEntity;
  reviewVdoCookie: MediaUrlCookie[];
}

export class ModifyReviewDao {
  modifyReviewDto: ModifyReviewDto;
  review: ReviewEntity;
}
