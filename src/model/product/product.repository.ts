import { CreateProductDto } from "./dto/create_product.dto";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductEntity } from "./product.entity";

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async findProductsAll(): Promise<ProductEntity[]> {
    return await this.productRepository.find();
  }

  async findProductOneByName(name: string): Promise<ProductEntity> {
    try {
      return await this.productRepository.findOneOrFail({ name });
    } catch (err) {
      throw new NotFoundException("해당 상품이름은 존재하지 않습니다.");
    }
  }

  async findProductOneById(id: string): Promise<ProductEntity> {
    try {
      return await this.productRepository.findOneOrFail({ id });
    } catch (err) {
      throw new NotFoundException("해당 상품아이디는 존재하지 않습니다.");
    }
  }

  async createProduct(createProductDto: CreateProductDto) {
    return await this.productRepository.save({ ...createProductDto });
  }
}
