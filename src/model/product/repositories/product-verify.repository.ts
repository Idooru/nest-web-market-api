import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityTarget, Repository } from "typeorm";
import { ProductEntity } from "../entities/product.entity";
import { ErrorHandlerProps } from "src/common/classes/error-handler-props";
import { ErrorHandlerBuilder } from "src/common/lib/error-handler/error-hanlder-builder";

@Injectable()
export class ProductVerifyRepository extends ErrorHandlerProps {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly errorHandlerBuilder: ErrorHandlerBuilder,
  ) {
    super();
  }

  async isExistProductId(id: string): Promise<boolean> {
    try {
      const result = await this.productRepository.exist({ where: { id } });
      return result ? true : false;
    } catch (err) {
      this.methodName = this.isExistProductId.name;
      this.errorHandlerBuilder
        .setEntity(ProductEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
    }
  }

  async isNotExistProductName(name: string): Promise<boolean> {
    try {
      const result = await this.productRepository.exist({ where: { name } });
      return result ? false : true;
    } catch (err) {
      this.methodName = this.isNotExistProductName.name;
      this.errorHandlerBuilder
        .setEntity(ProductEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
    }
  }
}
