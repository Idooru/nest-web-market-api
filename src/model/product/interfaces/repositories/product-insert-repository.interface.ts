import { ProductEntity } from "../../entities/product.entity";

export interface IProductInsertRepository {
  findOneProductById(id: string): Promise<ProductEntity>;
}
