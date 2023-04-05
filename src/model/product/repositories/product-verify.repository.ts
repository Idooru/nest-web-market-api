import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RepositoryErrorHandleLibrary } from "src/common/lib/error-handler/repository-error-handler.library";
import { Repository } from "typeorm";
import { ProductEntity } from "../entities/product.entity";
import { ErrorHandlerProps } from "src/common/classes/error-handler-props";

@Injectable()
export class ProductVerifyRepository extends ErrorHandlerProps {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly repositoryErrorHandler: RepositoryErrorHandleLibrary,
  ) {
    super();
  }

  async isExistProductId(id: string): Promise<boolean> {
    try {
      const result = await this.productRepository.exist({ where: { id } });
      return result ? true : false;
    } catch (err) {
      this.methodName = this.isExistProductId.name;
      this.repositoryErrorHandler.init<ProductEntity>(
        new ProductEntity(),
        this.className,
        this.methodName,
        err,
      );
    }
  }

  async isNotExistProductName(name: string): Promise<boolean> {
    try {
      const result = await this.productRepository.exist({ where: { name } });
      return result ? false : true;
    } catch (err) {
      this.methodName = this.isNotExistProductName.name;
      this.repositoryErrorHandler.init<ProductEntity>(
        new ProductEntity(),
        this.className,
        this.methodName,
        err,
      );
    }
  }
}
