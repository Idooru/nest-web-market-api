import { MediaDto } from "src/model/media/dto/media.dto";
import { ProductDto } from "./product.dto";
import { ProductEntity } from "../entities/product.entity";

export class InsertProductImageDto {
  productImgCookies: MediaDto[];
  productDto: ProductDto;
  product: ProductEntity;
}
