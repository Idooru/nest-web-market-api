import { ProductEntity } from "../entities/product.entity";
import { ProductBodyDto } from "./product-body.dto";
import { ProductImageEntity } from "../../media/entities/product-image.entity";

export class SearchModifyProductDto {
  product: ProductEntity;
  productBodyDto: ProductBodyDto;
  beforeProductImages: ProductImageEntity[];
  newProductImages: ProductImageEntity[];
}
