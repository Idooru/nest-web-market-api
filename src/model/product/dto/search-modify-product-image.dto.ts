import { ProductEntity } from "../entities/product.entity";
import { ProductImageEntity } from "../../media/entities/product-image.entity";

export class SearchModifyProductImageDto {
  product: ProductEntity;
  beforeProductImages: ProductImageEntity[];
  newProductImages: ProductImageEntity[];
}
