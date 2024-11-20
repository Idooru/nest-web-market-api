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

  public validateId(id: string): Promise<boolean> {
    return this.productRepository.exist({ where: { id } });
  }

  public validateName(name: string): Promise<boolean> {
    return this.productRepository.exist({ where: { name } });
  }
}
