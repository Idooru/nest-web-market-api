import { MediaDto } from "src/model/media/dto/media.dto";
import { ReviewDto } from "./review-request.dto";

export class PushReviewVideoDto {
  reviewRequestDto: ReviewDto;
  reviewVdoCookies: MediaDto[];
}
