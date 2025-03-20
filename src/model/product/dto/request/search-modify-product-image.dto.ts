import { ProductImageEntity } from "../../../media/entities/product-image.entity";

export class SearchModifyProductImageDto {
  public productId: string;
  public userId?: string;
  public beforeProductImages?: ProductImageEntity[];
  public newProductImages?: ProductImageEntity[];
}
