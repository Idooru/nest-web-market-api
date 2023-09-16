import { ProductEntity } from "../entities/product.entity";
import { ProductImageEntity } from "../../media/entities/product-image.entity";

export class InsertProductImageDto {
  productImages: ProductImageEntity[];
  product: ProductEntity;
}
