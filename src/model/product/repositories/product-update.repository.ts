import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductEntity } from "../entities/product.entity";
import { Repository } from "typeorm";
import { CreateProductDto } from "../dto/request/create-product.dto";
import { ModifyProductDto } from "../dto/request/modify-product.dto";
import { ProductCategory } from "../types/product-category.type";
import { Transactional } from "../../../common/interfaces/initializer/transactional";
import { ProductRepositoryPayload } from "../logic/transaction/product-repository.payload";
import { Transaction } from "../../../common/decorators/transaction.decorator";
import { General } from "../../../common/decorators/general.decoration";
import { InsertProductImageDto } from "../dto/request/insert-product-image.dto";

@Injectable()
export class ProductUpdateRepository {
  constructor(
    private readonly transaction: Transactional<ProductRepositoryPayload>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  @Transaction
  public async createProduct({ body, admin }: CreateProductDto): Promise<ProductEntity> {
    return await this.transaction.getRepository().product.save({
      ...body,
      AdminUser: admin,
    });
  }

  @Transaction
  public async createStarRate(product: ProductEntity): Promise<void> {
    await this.transaction.getRepository().starRate.save({ id: product.id });
  }

  @Transaction
  public async insertProductIdOnProductImage({ productImageId, productId }: InsertProductImageDto): Promise<void> {
    await this.transaction.getRepository().productImage.query(
      `UPDATE products_images 
       SET productId = ?
       WHERE id = ?`,
      [productId, productImageId],
    );
  }

  @Transaction
  public async deleteProductImageWithId(productId: string): Promise<void> {
    await this.transaction.getRepository().productImage.delete({ id: productId });
  }

  @Transaction
  public async modifyProduct({ productId, body }: ModifyProductDto): Promise<void> {
    await this.transaction.getRepository().product.update(productId, body);
  }

  @General
  public async modifyProductName(productId: string, name: string): Promise<void> {
    await this.productRepository.update(productId, { name });
  }

  @General
  public async modifyProductPrice(id: string, price: number): Promise<void> {
    await this.productRepository.update(id, { price });
  }

  @General
  public async modifyProductOrigin(id: string, origin: string): Promise<void> {
    await this.productRepository.update(id, { origin });
  }

  @General
  public async modifyProductCategory(id: string, category: ProductCategory): Promise<void> {
    await this.productRepository.update(id, { category });
  }

  @General
  public async modifyProductDescription(id: string, description: string): Promise<void> {
    await this.productRepository.update(id, { description });
  }

  @General
  public async modifyProductStock(id: string, stock: number): Promise<void> {
    await this.productRepository.update(id, { stock });
  }

  @General
  public async removeProduct(id: string): Promise<void> {
    await this.productRepository.delete({ id });
  }
}
