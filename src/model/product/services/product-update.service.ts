import { Injectable } from "@nestjs/common";
import { ProductUpdateRepository } from "../repositories/product-update.repository";
import { ProductEntity } from "../entities/product.entity";
import { CreateProductDto } from "../dto/create-product-dto";
import { ModifyProductDto } from "../dto/modify-product.dto";
import { InsertProductImageDto } from "../dto/insert-product-image.dto";
import { ChangeProductImageDto } from "../dto/change-product-image.dto";
import { ProductCategory } from "../types/product-category.type";
import { ProductSearcher } from "../logic/product.searcher";
import { MediaUtils } from "../../media/logic/media.utils";

@Injectable()
export class ProductUpdateService {
  constructor(
    private readonly productUpdateRepository: ProductUpdateRepository,
    private readonly productSearcher: ProductSearcher,
    private readonly mediaUtils: MediaUtils,
  ) {}

  // Transaction
  async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    return await this.productUpdateRepository.createProduct(createProductDto);
  }

  // Transaction
  async createStarRate(product: ProductEntity): Promise<void> {
    await this.productUpdateRepository.createStarRate(product);
  }

  // Transaction
  async insertProductImages(
    insertProductImageDto: InsertProductImageDto,
  ): Promise<void> {
    const { productImages, product } = insertProductImageDto;
    const inserting = productImages.map((productImage) =>
      this.productUpdateRepository.insertProductIdOnProductImage(
        productImage,
        product,
      ),
    );

    await Promise.all(inserting);
  }

  // Transaction
  async modifyProduct(modifyProductDto: ModifyProductDto): Promise<void> {
    await this.productUpdateRepository.modifyProduct(modifyProductDto);
  }

  // Transaction
  async changeProductImages(
    changeProductImageDto: ChangeProductImageDto,
  ): Promise<void> {
    const { beforeProductImages, newProductImages, product } =
      changeProductImageDto;

    const inserting = newProductImages.map((productImage) =>
      this.productUpdateRepository.insertProductIdOnProductImage(
        productImage,
        product,
      ),
    );

    await Promise.all(inserting);

    if (beforeProductImages.length >= 1) {
      const deleting = beforeProductImages.map((productImage) =>
        this.productUpdateRepository.deleteProductImageWithId(productImage.id),
      );

      this.mediaUtils.deleteMediaFiles({
        images: beforeProductImages,
        mediaEntity: "product",
        callWhere: "remove media entity",
      });

      await Promise.all(deleting);
    }
  }

  // Transaction
  async decreaseProductQuantities(
    productQuantities: { product: ProductEntity; quantity: number }[],
  ): Promise<void> {
    const decreasing = productQuantities.map((productQuantitiy) =>
      this.productUpdateRepository.decreaseProductQuantity(productQuantitiy),
    );

    await Promise.all(decreasing);
  }

  // General
  async modifyProductName(id: string, name: string): Promise<void> {
    await this.productUpdateRepository.modifyProductName(id, name);
  }

  // General
  async modifyProductPrice(id: string, price: number): Promise<void> {
    await this.productUpdateRepository.modifyProductPrice(id, price);
  }

  // General
  async modifyProductOrigin(id: string, origin: string): Promise<void> {
    await this.productUpdateRepository.modifyProductOrigin(id, origin);
  }

  // General
  async modifyProductCategory(
    id: string,
    category: ProductCategory,
  ): Promise<void> {
    await this.productUpdateRepository.modifyProductCategory(id, category);
  }

  // General
  async modifyProductDescription(
    id: string,
    description: string,
  ): Promise<void> {
    await this.productUpdateRepository.modifyProductDescription(
      id,
      description,
    );
  }

  // General
  async modifyProductQuantity(id: string, quantity: number): Promise<void> {
    await this.productUpdateRepository.modifyProductQuantity(id, quantity);
  }

  // General
  async removeProduct(id: string): Promise<void> {
    const product = await this.productSearcher.findProductWithId(id);

    this.mediaUtils.deleteMediaFiles({
      images: product.Image,
      mediaEntity: "product",
      callWhere: "remove media entity",
    });

    await this.productUpdateRepository.removeProduct(id);
  }
}
