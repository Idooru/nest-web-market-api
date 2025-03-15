import { Injectable } from "@nestjs/common";
import { ProductUpdateRepository } from "../repositories/product-update.repository";
import { ProductEntity } from "../entities/product.entity";
import { CreateProductDto } from "../dto/create-product.dto";
import { ModifyProductDto } from "../dto/modify-product.dto";
import { InsertProductImagesDto } from "../dto/insert-product-image.dto";
import { ChangeProductImageDto } from "../dto/change-product-image.dto";
import { ProductCategory } from "../types/product-category.type";
import { ProductSearcher } from "../logic/product.searcher";
import { MediaUtils } from "../../media/logic/media.utils";
import { Transaction } from "../../../common/decorators/transaction.decorator";
import { General } from "../../../common/decorators/general.decoration";

@Injectable()
export class ProductService {
  constructor(
    private readonly productUpdateRepository: ProductUpdateRepository,
    private readonly productSearcher: ProductSearcher,
    private readonly mediaUtils: MediaUtils,
  ) {}

  @Transaction
  public createProduct(dto: CreateProductDto): Promise<ProductEntity> {
    return this.productUpdateRepository.createProduct(dto);
  }

  @Transaction
  public async createStarRate(product: ProductEntity): Promise<void> {
    await this.productUpdateRepository.createStarRate(product);
  }

  @Transaction
  public async insertProductImages({ productId, productImages }: InsertProductImagesDto): Promise<void> {
    const inserting = productImages.map((productImage) => {
      const insertProductImageDto = { productId, productImageId: productImage.id };
      return this.productUpdateRepository.insertProductIdOnProductImage(insertProductImageDto);
    });

    await Promise.all(inserting);
  }

  @Transaction
  public async modifyProduct(dto: ModifyProductDto): Promise<void> {
    await this.productUpdateRepository.modifyProduct(dto);
  }

  @Transaction
  public async changeProductImages(dto: ChangeProductImageDto): Promise<void> {
    const { productId, beforeProductImages, newProductImages } = dto;

    const inserting = newProductImages.map((productImage) => {
      const insertProductImageDto = { productId, productImageId: productImage.id };
      return this.productUpdateRepository.insertProductIdOnProductImage(insertProductImageDto);
    });

    const deleting = beforeProductImages.map((productImage) =>
      this.productUpdateRepository.deleteProductImageWithId(productImage.id),
    );

    this.mediaUtils.deleteMediaFiles({
      images: beforeProductImages,
      mediaEntity: "product",
      callWhere: "remove media entity",
    });

    await Promise.all([inserting, deleting]);
  }

  @General
  public async modifyProductName(id: string, name: string): Promise<void> {
    await this.productUpdateRepository.modifyProductName(id, name);
  }

  @General
  public async modifyProductPrice(id: string, price: number): Promise<void> {
    await this.productUpdateRepository.modifyProductPrice(id, price);
  }

  @General
  public async modifyProductOrigin(id: string, origin: string): Promise<void> {
    await this.productUpdateRepository.modifyProductOrigin(id, origin);
  }

  @General
  public async modifyProductCategory(id: string, category: ProductCategory): Promise<void> {
    await this.productUpdateRepository.modifyProductCategory(id, category);
  }

  @General
  public async modifyProductDescription(id: string, description: string): Promise<void> {
    await this.productUpdateRepository.modifyProductDescription(id, description);
  }

  @General
  public async modifyProductStock(id: string, stock: number): Promise<void> {
    await this.productUpdateRepository.modifyProductStock(id, stock);
  }

  @General
  public async removeProduct(id: string): Promise<void> {
    const product = await this.productSearcher.findProductWithId(id);

    this.mediaUtils.deleteMediaFiles({
      images: product.Image,
      mediaEntity: "product",
      callWhere: "remove media entity",
    });

    await this.productUpdateRepository.removeProduct(id);
  }
}
