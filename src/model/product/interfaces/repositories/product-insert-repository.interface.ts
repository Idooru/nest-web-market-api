import { AdminUserEntity } from "src/model/user/entities/admin-user.entity";
import { ProductEntity } from "../../entities/product.entity";

export interface IProductInsertRepository {
  findOneProductById(id: string): Promise<ProductEntity>;
  insertProductIdOnAdminUser(
    adminUser: AdminUserEntity,
    product: ProductEntity,
  ): Promise<void>;
}
