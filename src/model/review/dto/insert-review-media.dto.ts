import { MediaCookieDto } from "src/model/media/dto/media-cookie.dto";
import { ReviewEntity } from "../entities/review.entity";
import { ReviewBodyDto } from "./review.dto";

export class InsertReviewMediaDto {
  reviewRequestDto: ReviewBodyDto;
  review: ReviewEntity;
  reviewImgCookies?: MediaCookieDto[];
  reviewVdoCookies?: MediaCookieDto[];
}
