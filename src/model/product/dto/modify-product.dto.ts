import { MediaCookieDto } from "../../media/dto/media-cookie.dto";
import { ProductBody } from "./product-body.dto";

export class ModifyProductDto {
  productId?: string;
  body: ProductBody;
  productImgCookies?: MediaCookieDto[];
}
