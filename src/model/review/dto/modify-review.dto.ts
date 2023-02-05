import { CreateReviewDto } from "./create-review.dto";
import { ReviewEntity } from "../entities/review.entity";
import { MediaUrlCookies } from "src/model/upload/media.url.cookies.interface";

export class ModifyReviewDto extends CreateReviewDto {}

export class ModifyReviewWithImageAndVideoDto {
  modifyReviewDto: ModifyReviewDto;
  review: ReviewEntity;
  reviewImgCookie: MediaUrlCookies[];
  reviewVdoCookie: MediaUrlCookies[];
}

export class ModifyReviewWithImageDto {
  modifyReviewDto: ModifyReviewDto;
  review: ReviewEntity;
  reviewImgCookie: MediaUrlCookies[];
}

export class ModifyReviewWithVideoDto {
  modifyReviewDto: ModifyReviewDto;
  review: ReviewEntity;
  reviewVdoCookie: MediaUrlCookies[];
}

export class ModifyReviewDao {
  modifyReviewDto: ModifyReviewDto;
  review: ReviewEntity;
}
