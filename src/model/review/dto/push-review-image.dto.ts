import { MediaCookieDto } from "src/model/media/dto/media-cookie.dto";
import { ReviewBodyDto } from "./review-body.dto";

export class PushReviewImageDto {
  reviewRequestDto: ReviewBodyDto;
  reviewImgCookies: MediaCookieDto[];
}
