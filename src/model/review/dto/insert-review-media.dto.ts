import { RequestMediaDto } from "src/model/media/dto/request-media.dto";
import { ReviewEntity } from "../entities/review.entity";
import { ReviewRequestDto } from "./review-request.dto";

export class InsertReviewMediaDto {
  reviewRequestDto: ReviewRequestDto;
  review: ReviewEntity;
  reviewImgCookies?: RequestMediaDto[];
  reviewVdoCookies?: RequestMediaDto[];
}
