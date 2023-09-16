import { ProductImageEntity } from "../../media/entities/product-image.entity";
import { ProductEntity } from "../entities/product.entity";

export class ModifyProductImageDto {
  beforeProductImages: ProductImageEntity[];
  newProductImages: ProductImageEntity[];
  product: ProductEntity;
}
