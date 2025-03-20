import { MediaCookieDto } from "../../../media/dto/media-cookie.dto";

export class ModifyProductImageDto {
  productId: string;
  productImgCookies: MediaCookieDto[];
}
