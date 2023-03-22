import { RequestMediaDto } from "src/model/media/dto/request-media.dto";
import { ReviewRequestDto } from "./review-request.dto";

export class PushReviewVideoDto {
  reviewRequestDto: ReviewRequestDto;
  reviewVdoCookies: RequestMediaDto[];
}
