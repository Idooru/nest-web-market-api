import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductEntity } from "../entities/product.entity";
import { Repository } from "typeorm";

@Injectable()
export class ProductValidateRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async isExistId(id: string): Promise<boolean> {
    return await this.productRepository.exist({ where: { id } });
  }

  async isNoneExistName(name: string): Promise<boolean> {
    return await this.productRepository.exist({ where: { name } });
  }
}
