import { Injectable } from "@nestjs/common";
import { ProductRepositoryVO } from "../logic/transaction/product-repository.vo";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductEntity } from "../entities/product.entity";
import { Repository } from "typeorm";
import { CreateProductDto } from "../dto/create-product-dto";
import { ModifyProductDto } from "../dto/modify-product.dto";
import { ProductCategory } from "../types/product-category.type";
import { ProductImageEntity } from "../../media/entities/product-image.entity";

@Injectable()
export class ProductUpdateRepository {
  constructor(
    private readonly queryRunner: ProductRepositoryVO,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  // Transaction
  async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    const { productBodyDto, admin } = createProductDto;
    const { name, price, origin, category, description, quantity } =
      productBodyDto;

    return await this.queryRunner.productRepository.save({
      name,
      price,
      origin,
      category,
      description,
      quantity,
      creater: admin,
    });
  }

  // Transaction
  async createStarRate(product: ProductEntity): Promise<void> {
    await this.queryRunner.starRateRepository.save({ id: product.id });
  }

  // Transaction
  async insertProductIdOnProductImage(
    productImage: ProductImageEntity,
    product: ProductEntity,
  ): Promise<void> {
    productImage.Product = product;
    await this.queryRunner.productImageRepository.save(productImage);
  }

  // Transaction
  async deleteProductImageWithId(id: string): Promise<void> {
    await this.queryRunner.productImageRepository.delete({ id });
  }

  // Transaction
  async modifyProduct(modifyProductDto: ModifyProductDto): Promise<void> {
    const { id, productBodyDto } = modifyProductDto;

    await this.queryRunner.productRepository.update(id, productBodyDto);
  }

  // General
  async modifyProductName(id: string, name: string): Promise<void> {
    await this.productRepository.update(id, { name });
  }

  // General
  async modifyProductPrice(id: string, price: number): Promise<void> {
    await this.productRepository.update(id, { price });
  }

  // General
  async modifyProductOrigin(id: string, origin: string): Promise<void> {
    await this.productRepository.update(id, { origin });
  }

  // General
  async modifyProductCategory(
    id: string,
    category: ProductCategory,
  ): Promise<void> {
    await this.productRepository.update(id, { category });
  }

  // General
  async modifyProductDescription(
    id: string,
    description: string,
  ): Promise<void> {
    await this.productRepository.update(id, { description });
  }

  // General
  async modifyProductQuantity(id: string, quantity: number): Promise<void> {
    await this.productRepository.update(id, { quantity });
  }

  // General
  async removeProduct(id: string): Promise<void> {
    await this.productRepository.delete({ id });
  }
}
