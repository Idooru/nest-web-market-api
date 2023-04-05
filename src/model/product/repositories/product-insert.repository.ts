import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RepositoryLayerErrorHandleLibrary } from "src/common/lib/error-handler/repository-error-handler.library";
import { Repository } from "typeorm";
import { ProductEntity } from "../entities/product.entity";
import { ErrorHandlerProps } from "src/common/classes/error-handler-props";

@Injectable()
export class ProductInsertRepository extends ErrorHandlerProps {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly repositoryErrorHandler: RepositoryLayerErrorHandleLibrary,
  ) {
    super();
  }

  async findLastCreatedProduct(): Promise<ProductEntity> {
    try {
      return await this.productRepository
        .createQueryBuilder()
        .select("product")
        .from(ProductEntity, "product")
        .orderBy("product.createdAt", "DESC")
        .limit(1)
        .getOne();
    } catch (err) {
      this.methodName = this.findLastCreatedProduct.name;
      this.repositoryErrorHandler.init<ProductEntity>(
        new ProductEntity(),
        this.className,
        this.methodName,
        err,
      );
    }
  }
}
