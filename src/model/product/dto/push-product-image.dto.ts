import { MediaDto } from "src/model/media/dto/media.dto";
import { ProductDto } from "./product.dto";

export class PushProductImageDto {
  productDto: ProductDto;
  productImgCookies: MediaDto[];
}
