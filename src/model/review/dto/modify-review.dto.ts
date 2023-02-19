import { CreateReviewDto } from "./create-review.dto";
import { ReviewEntity } from "../entities/review.entity";
import { MediaUrlCookieValue } from "src/model/upload/media.url.cookies.interface";

export class ModifyReviewDto extends CreateReviewDto {}

export class ModifyReviewWithImageAndVideoDto {
  modifyReviewDto: ModifyReviewDto;
  review: ReviewEntity;
  reviewImgCookie: MediaUrlCookieValue[];
  reviewVdoCookie: MediaUrlCookieValue[];
}

export class ModifyReviewWithImageDto {
  modifyReviewDto: ModifyReviewDto;
  review: ReviewEntity;
  reviewImgCookie: MediaUrlCookieValue[];
}

export class ModifyReviewWithVideoDto {
  modifyReviewDto: ModifyReviewDto;
  review: ReviewEntity;
  reviewVdoCookie: MediaUrlCookieValue[];
}

export class ModifyReviewDao {
  modifyReviewDto: ModifyReviewDto;
  review: ReviewEntity;
}
