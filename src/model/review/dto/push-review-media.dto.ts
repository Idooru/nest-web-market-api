import { MediaCookieDto } from "src/model/media/dto/media-cookie.dto";
import { ReviewBodyDto } from "./review.dto";

export class PushReviewMediaDto {
  reviewRequestDto: ReviewBodyDto;
  reviewImgCookies?: MediaCookieDto[];
  reviewVdoCookies?: MediaCookieDto[];
}
