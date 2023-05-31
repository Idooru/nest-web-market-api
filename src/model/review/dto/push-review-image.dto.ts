import { MediaDto } from "src/model/media/dto/media.dto";
import { ReviewDto } from "./review.dto";

export class PushReviewImageDto {
  reviewRequestDto: ReviewDto;
  reviewImgCookies: MediaDto[];
}
