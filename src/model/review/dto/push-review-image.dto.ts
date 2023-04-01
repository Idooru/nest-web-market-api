import { MediaDto } from "src/model/media/dto/media.dto";
import { ReviewRequestDto } from "./review-request.dto";

export class PushReviewImageDto {
  reviewRequestDto: ReviewRequestDto;
  reviewImgCookies: MediaDto[];
}
