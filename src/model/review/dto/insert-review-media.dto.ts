import { MediaDto } from "src/model/media/dto/media.dto";
import { ReviewEntity } from "../entities/review.entity";
import { ReviewDto } from "./review.dto";

export class InsertReviewMediaDto {
  reviewRequestDto: ReviewDto;
  review: ReviewEntity;
  reviewImgCookies?: MediaDto[];
  reviewVdoCookies?: MediaDto[];
}
