import { ProductBody } from "./product-body.dto";
import { MediaCookieDto } from "../../../media/dto/request/media-cookie.dto";

export class ModifyProductDto {
  productId?: string;
  body: ProductBody;
  productImgCookies?: MediaCookieDto[];
}
