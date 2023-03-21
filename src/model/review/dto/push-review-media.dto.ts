import { RequestMediaDto } from "src/model/media/dto/request-media.dto";
import { ReviewRequestDto } from "./review-request.dto";

export class PushReviewMediaDto {
  reviewRequestDto: ReviewRequestDto;
  reviewImgCookies?: RequestMediaDto[];
  reviewVdoCookies?: RequestMediaDto[];
}
