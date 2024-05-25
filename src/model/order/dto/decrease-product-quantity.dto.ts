import { ProductEntity } from "../../product/entities/product.entity";

export class DecreaseProductQuantityDto {
  product: ProductEntity;
  quantity: number;
}
