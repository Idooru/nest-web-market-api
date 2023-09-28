import { MediaCookieDto } from "src/model/media/dto/media-cookie.dto";
import { ReviewBodyDto } from "./review-body.dto";

export class PushReviewVideoDto {
  reviewRequestDto: ReviewBodyDto;
  reviewVdoCookies: MediaCookieDto[];
}
