import { MediaCookieDto } from "../../../media/dto/request/media-cookie.dto";

export class ModifyProductImageDto {
  productId: string;
  productImgCookies: MediaCookieDto[];
}
