import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityTarget, Repository } from "typeorm";
import { ProductEntity } from "../entities/product.entity";
import { ErrorHandlerProps } from "src/common/classes/error-handler-props";
import { ErrorHandlerBuilder } from "src/common/lib/error-handler/error-hanlder-builder";

@Injectable()
export class ProductInsertRepository extends ErrorHandlerProps {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly errorHandlerBuilder: ErrorHandlerBuilder,
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
      this.errorHandlerBuilder
        .setEntity(ProductEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
    }
  }
}
