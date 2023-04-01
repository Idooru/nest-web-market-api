import { MediaDto } from "src/model/media/dto/media.dto";
import { ReviewEntity } from "../entities/review.entity";
import { ReviewRequestDto } from "./review-request.dto";

export class InsertReviewMediaDto {
  reviewRequestDto: ReviewRequestDto;
  review: ReviewEntity;
  reviewImgCookies?: MediaDto[];
  reviewVdoCookies?: MediaDto[];
}
