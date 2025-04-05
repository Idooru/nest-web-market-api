import { ReviewBody } from "./review-body.dto";
import { MediaCookieDto } from "../../../media/dto/request/media-cookie.dto";

export class CreateReviewDto {
  public body: ReviewBody;
  public reviewerId: string;
  public productId: string;
  public reviewImgCookies: MediaCookieDto[];
  public reviewVdoCookies: MediaCookieDto[];
}

export class CreateReviewRowDto {
  public body: ReviewBody;
  public productId: string;
  public reviewerId: string;
}
