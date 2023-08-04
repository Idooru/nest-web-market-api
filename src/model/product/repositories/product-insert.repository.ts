import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductEntity } from "../entities/product.entity";
import { ErrorHandlerProps } from "src/common/classes/abstract/error-handler-props";
import { TypeOrmErrorHandlingBuilder } from "src/common/lib/error-handler/typeorm-error-handling.builder";
import { IProductInsertRepository } from "../interfaces/repositories/product-insert-repository.interface";
import { ProductErrorHandler } from "../error/product-error.handler";
import { AdminUserEntity } from "src/model/user/entities/admin-user.entity";

@Injectable()
export class ProductInsertRepository
  extends ErrorHandlerProps
  implements IProductInsertRepository
{
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly typeOrmErrorHandlerBuilder: TypeOrmErrorHandlingBuilder,
  ) {
    super();
  }

  async findOneProductById(id: string): Promise<ProductEntity> {
    try {
      return await this.productRepository
        .createQueryBuilder()
        .select("product")
        .from(ProductEntity, "product")
        .where("product.id = :id", { id })
        .getOneOrFail();
    } catch (err) {
      this.methodName = this.findOneProductById.name;
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(ProductErrorHandler)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .handle();
    }
  }

  async insertProductIdOnAdminUser(
    adminUser: AdminUserEntity,
    product: ProductEntity,
  ): Promise<void> {
    try {
      await this.productRepository
        .createQueryBuilder()
        .update(ProductEntity)
        .set({ creater: adminUser })
        .where("id = :id", { id: product.id })
        .execute();
    } catch (err) {
      this.methodName = this.insertProductIdOnAdminUser.name;
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(ProductErrorHandler)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .handle();
    }
  }
}
