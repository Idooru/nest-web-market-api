import { ModifyProductDto } from "./dto/modify_product.dto";
import { CreateProductDto } from "./dto/create_product.dto";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductEntity } from "./product.entity";

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async checkProductNameToCreate(name: string) {
    const found = await this.productRepository.findOne({
      select: ["name"],
      where: { name },
    });

    if (found.name) {
      throw new BadRequestException("해당 상품명은 사용중입니다.");
    }
  }

  async checkProductNameToModify(replaceName: string, originalName: string) {
    const found = await this.productRepository.findOne({
      select: ["name"],
      where: { name: replaceName },
    });

    if (found.name === originalName) {
      return;
    }
    throw new BadRequestException("해당 상품명은 사용중입니다.");
  }

  async checkProductIdToExist(id: string) {
    const found = await this.productRepository.findOne({ id });

    if (!found) {
      throw new BadRequestException("해당 상품 아이디는 존재하지 않습니다.");
    }
  }

  async findProductsAllFromLatest(): Promise<ProductEntity[]> {
    return await this.productRepository.find({ order: { createdAt: "DESC" } });
  }

  async findProductsAllFromOldest(): Promise<ProductEntity[]> {
    return await this.productRepository.find({ order: { createdAt: "ASC" } });
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
      throw new NotFoundException("해당 상품 아이디는 존재하지 않습니다.");
    }
  }

  async createProduct(createProductDto: CreateProductDto): Promise<void> {
    await this.productRepository.save({ ...createProductDto });
  }

  async modifyProduct(
    id: string,
    modifyProductDto: ModifyProductDto,
  ): Promise<void> {
    await this.productRepository.update(id, modifyProductDto);
  }

  async removeProduct(id: string): Promise<void> {
    await this.productRepository.delete(id);
  }
}
