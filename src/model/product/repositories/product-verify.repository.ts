import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductEntity } from "../entities/product.entity";
import { ErrorHandlerProps } from "src/common/classes/abstract/error-handler-props";
import { TypeOrmErrorHandlerBuilder } from "src/common/lib/error-handler/typeorm-error-handling.builder";
import { IProductVerifyRepository } from "../interfaces/repositories/product-verify-repository.interface";
import { ProductErrorHandler } from "../error/product-error.handler";

@Injectable()
export class ProductVerifyRepository
  extends ErrorHandlerProps
  implements IProductVerifyRepository
{
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly typeOrmErrorHandlerBuilder: TypeOrmErrorHandlerBuilder,
  ) {
    super();
  }

  async isExistProductId(id: string): Promise<boolean> {
    try {
      const result = await this.productRepository.exist({ where: { id } });
      return result ? true : false;
    } catch (err) {
      this.methodName = this.isExistProductId.name;
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(ProductErrorHandler)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .handle();
    }
  }

  async isNotExistProductName(name: string): Promise<boolean> {
    try {
      const result = await this.productRepository.exist({ where: { name } });
      return result ? false : true;
    } catch (err) {
      this.methodName = this.isNotExistProductName.name;
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(ProductErrorHandler)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .handle();
    }
  }
}
