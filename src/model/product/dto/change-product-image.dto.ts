import { ProductImageEntity } from "../../media/entities/product-image.entity";
import { ProductEntity } from "../entities/product.entity";

export class ChangeProductImageDto {
  public beforeProductImages: ProductImageEntity[];
  public newProductImages: ProductImageEntity[];
  public product: ProductEntity;
}
