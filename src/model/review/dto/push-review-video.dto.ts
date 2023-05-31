import { MediaDto } from "src/model/media/dto/media.dto";
import { ReviewDto } from "./review.dto";

export class PushReviewVideoDto {
  reviewRequestDto: ReviewDto;
  reviewVdoCookies: MediaDto[];
}
