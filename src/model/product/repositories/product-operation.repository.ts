import { Injectable } from "@nestjs/common";
import { ProductRepositoryVO } from "../logic/product-repository.vo";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductEntity } from "../entities/product.entity";
import { Repository } from "typeorm";
import { CreateProductDto } from "../dto/create-product-dto";
import { ModifyProductDto } from "../dto/modify-product.dto";
import { ProductCategory } from "../types/product-category.type";
import { ProductImageEntity } from "../../media/entities/product-image.entity";

@Injectable()
export class ProductOperationRepository {
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

    return await this.queryRunner.getProductRepository().save({
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
    await this.queryRunner.getStarRateRepository().save({ id: product.id });
  }

  // Transaction
  async insertProductIdOnProductImage(
    productImage: ProductImageEntity,
    product: ProductEntity,
  ): Promise<void> {
    productImage.Product = product;
    await this.queryRunner.getProductImageRepository().save(productImage);
  }

  // Transaction
  async deleteProductImageWithId(id: string): Promise<void> {
    await this.queryRunner.getProductImageRepository().delete({ id });
  }

  // Transaction
  async modifyProduct(modifyProductDto: ModifyProductDto): Promise<void> {
    const { product, productBodyDto } = modifyProductDto;

    product.name = productBodyDto.name;
    product.price = productBodyDto.price;
    product.origin = productBodyDto.origin;
    product.category = productBodyDto.category;
    product.description = productBodyDto.description;
    product.quantity = productBodyDto.quantity;

    await this.queryRunner.getProductRepository().save(product);
  }

  // General
  async modifyProductName(product: ProductEntity, name: string): Promise<void> {
    product.name = name;
    await this.productRepository.save(product);
  }

  // General
  async modifyProductPrice(
    product: ProductEntity,
    price: number,
  ): Promise<void> {
    product.price = price;
    await this.productRepository.save(product);
  }

  // General
  async modifyProductOrigin(
    product: ProductEntity,
    origin: string,
  ): Promise<void> {
    product.origin = origin;
    await this.productRepository.save(product);
  }

  // General
  async modifyProductCategory(
    product: ProductEntity,
    category: ProductCategory,
  ): Promise<void> {
    product.category = category;
    await this.productRepository.save(product);
  }

  // General
  async modifyProductDescription(
    product: ProductEntity,
    description: string,
  ): Promise<void> {
    product.description = description;
    await this.productRepository.save(product);
  }

  // General
  async modifyProductQuantity(
    product: ProductEntity,
    quantity: number,
  ): Promise<void> {
    product.quantity = quantity;
    await this.productRepository.save(product);
  }

  // General
  async removeProduct(id: string): Promise<void> {
    await this.productRepository.delete({ id });
  }
}
