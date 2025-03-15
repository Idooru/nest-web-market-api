import { ProductEntity } from "../entities/product.entity";

export class ProductsResponseDto {
  public product: ProductEntity;
  public reviewCount: number;
}
