import { Injectable } from "@nestjs/common";
import { ProductOperationRepository } from "../repositories/product-operation.repository";
import { ProductSearcher } from "../logic/product.searcher";
import { ProductEntity } from "../entities/product.entity";
import { CreateProductDto } from "../dto/create-product-dto";
import { ModifyProductDto } from "../dto/modify-product.dto";
import { InsertProductImageDto } from "../dto/insert-product-image.dto";
import { ModifyProductImageDto } from "../dto/modify-product-image.dto";
import { ProductCategory } from "../types/product-category.type";

@Injectable()
export class ProductOperationService {
  constructor(
    private readonly productOperationRepository: ProductOperationRepository,
    private readonly productSearcher: ProductSearcher,
  ) {}

  // Transaction
  async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    return await this.productOperationRepository.createProduct(
      createProductDto,
    );
  }

  // Transaction
  async createStarRate(product: ProductEntity): Promise<void> {
    await this.productOperationRepository.createStarRate(product);
  }

  // Transaction
  async insertProductImages(
    insertProductImageDto: InsertProductImageDto,
  ): Promise<void> {
    const { productImages, product } = insertProductImageDto;
    const insertWork = productImages.map(async (productImage) => {
      await this.productOperationRepository.insertProductIdOnProductImage(
        productImage,
        product,
      );
    });

    await Promise.all(insertWork);
  }

  // Transaction
  async modifyProduct(modifyProductDto: ModifyProductDto): Promise<void> {
    await this.productOperationRepository.modifyProduct(modifyProductDto);
  }

  // Transaction
  async modifyProductImages(
    modifyProductImageDto: ModifyProductImageDto,
  ): Promise<void> {
    const { beforeProductImages, newProductImages, product } =
      modifyProductImageDto;
    const modifyWork = newProductImages.map(async (productImage) => {
      await this.productOperationRepository.insertProductIdOnProductImage(
        productImage,
        product,
      );
    });

    await Promise.all(modifyWork);

    if (beforeProductImages.length >= 1) {
      const deleteWork = beforeProductImages.map(async (productImage) => {
        await this.productOperationRepository.deleteProductImageWithId(
          productImage.id,
        );
      });

      await Promise.all(deleteWork);
    }
  }

  // General
  async modifyProductName(id: string, name: string): Promise<void> {
    await this.productSearcher.isInvalidProductName(name);
    await this.productOperationRepository.modifyProductName(id, name);
  }

  // General
  async modifyProductPrice(id: string, price: number): Promise<void> {
    await this.productOperationRepository.modifyProductPrice(id, price);
  }

  // General
  async modifyProductOrigin(id: string, origin: string): Promise<void> {
    await this.productOperationRepository.modifyProductOrigin(id, origin);
  }

  // General
  async modifyProductCategory(
    id: string,
    category: ProductCategory,
  ): Promise<void> {
    await this.productOperationRepository.modifyProductCategory(id, category);
  }

  // General
  async modifyProductDescription(
    id: string,
    description: string,
  ): Promise<void> {
    await this.productOperationRepository.modifyProductDescription(
      id,
      description,
    );
  }

  // General
  async modifyProductQuantity(id: string, quantity: number): Promise<void> {
    await this.productOperationRepository.modifyProductQuantity(id, quantity);
  }

  // General
  async removeProduct(id: string): Promise<void> {
    await this.productOperationRepository.removeProduct(id);
  }
}
