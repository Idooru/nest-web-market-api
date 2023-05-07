import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductEntity } from "../entities/product.entity";
import { ErrorHandlerProps } from "src/common/classes/abstract/error-handler-props";
import { TypeOrmErrorHandlerBuilder } from "src/common/lib/error-handler/typeorm-error-handler.builder";

@Injectable()
export class ProductInsertRepository extends ErrorHandlerProps {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly typeOrmErrorHandlerBuilder: TypeOrmErrorHandlerBuilder,
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
        .setEntity(ProductEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .handle();
    }
  }
}
