import { MediaCookieDto } from "../../media/dto/media-cookie.dto";
import { ProductBodyDto } from "./product-body.dto";
import { ProductEntity } from "../entities/product.entity";

export class ModifyProductDto {
  productBodyDto: ProductBodyDto;
  id?: string;
  product?: ProductEntity;
  productImgCookies?: MediaCookieDto[];
}
