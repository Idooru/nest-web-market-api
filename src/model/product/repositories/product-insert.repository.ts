import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RepositoryLogger } from "src/common/classes/repository.logger";
import { Repository } from "typeorm";
import { ProductEntity } from "../entities/product.entity";

@Injectable()
export class ProductInsertRepository extends RepositoryLogger {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {
    super("Product Insert");
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
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }
}
