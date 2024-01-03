import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductEntity } from "../entities/product.entity";
import { Repository } from "typeorm";
import { CreateProductDto } from "../dto/create-product-dto";
import { ModifyProductDto } from "../dto/modify-product.dto";
import { ProductCategory } from "../types/product-category.type";
import { ProductImageEntity } from "../../media/entities/product-image.entity";
import { Transactional } from "../../../common/interfaces/initializer/transactional";
import { ProductRepositoryPayload } from "../logic/transaction/product-repository.payload";

@Injectable()
export class ProductUpdateRepository {
  constructor(
    private readonly transaction: Transactional<ProductRepositoryPayload>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  // Transaction
  public async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    const { productBodyDto, admin } = createProductDto;
    const { name, price, origin, category, description, quantity } =
      productBodyDto;

    return await this.transaction.getRepository().product.save({
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
  public async createStarRate(product: ProductEntity): Promise<void> {
    await this.transaction.getRepository().starRate.save({ id: product.id });
  }

  // Transaction
  public async insertProductIdOnProductImage(
    productImage: ProductImageEntity,
    product: ProductEntity,
  ): Promise<void> {
    productImage.Product = product;
    await this.transaction.getRepository().product.save(productImage);
  }

  // Transaction
  public async deleteProductImageWithId(id: string): Promise<void> {
    await this.transaction.getRepository().productImage.delete({ id });
  }

  // Transaction
  public async modifyProduct(
    modifyProductDto: ModifyProductDto,
  ): Promise<void> {
    const { id, productBodyDto } = modifyProductDto;

    await this.transaction.getRepository().product.update(id, productBodyDto);
  }

  // General
  public async modifyProductName(id: string, name: string): Promise<void> {
    await this.productRepository.update(id, { name });
  }

  // General
  public async modifyProductPrice(id: string, price: number): Promise<void> {
    await this.productRepository.update(id, { price });
  }

  // General
  public async modifyProductOrigin(id: string, origin: string): Promise<void> {
    await this.productRepository.update(id, { origin });
  }

  // General
  public async modifyProductCategory(
    id: string,
    category: ProductCategory,
  ): Promise<void> {
    await this.productRepository.update(id, { category });
  }

  // General
  public async modifyProductDescription(
    id: string,
    description: string,
  ): Promise<void> {
    await this.productRepository.update(id, { description });
  }

  // General
  public async modifyProductQuantity(
    id: string,
    quantity: number,
  ): Promise<void> {
    await this.productRepository.update(id, { quantity });
  }

  // General
  public async removeProduct(id: string): Promise<void> {
    await this.productRepository.delete({ id });
  }
}
