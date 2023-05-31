import { MediaDto } from "src/model/media/dto/media.dto";
import { ReviewDto } from "./review.dto";

export class PushReviewMediaDto {
  reviewRequestDto: ReviewDto;
  reviewImgCookies?: MediaDto[];
  reviewVdoCookies?: MediaDto[];
}
