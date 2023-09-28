import { MediaCookieDto } from "src/model/media/dto/media-cookie.dto";
import { ReviewBodyDto } from "./review.dto";

export class PushReviewVideoDto {
  reviewRequestDto: ReviewBodyDto;
  reviewVdoCookies: MediaCookieDto[];
}
