import { ProductEntity } from "../../../product/entities/product.entity";

export class DecreaseProductStockDto {
  product: ProductEntity;
  quantity: number;
}
