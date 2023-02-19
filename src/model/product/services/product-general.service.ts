import { StarRatingRepository } from "../../review/providers/star-rating.repository";
import { ProductEntity } from "../entities/product.entity";
import { UploadRepository } from "../../upload/repositories/upload.repository";
import { ProductGeneralRepository } from "../repositories/product-general.repository";
import { Injectable } from "@nestjs/common";
import { CreateProductDto } from "../dto/create_product.dto";
import { ModifyProductDto } from "../dto/modify_product.dto";
import { MediaUrlCookieValue } from "src/model/upload/media.url.cookies.interface";
import { ProductImageEntity } from "src/model/upload/entities/product.image.entity";

@Injectable()
export class ProductGeneralService {
  constructor(
    private readonly productGeneralRepository: ProductGeneralRepository,
    private readonly uploadRepository: UploadRepository,
    private readonly starRatingRepository: StarRatingRepository,
  ) {}

  async getProductsAllFromLatest(): Promise<ProductEntity[]> {
    return await this.productGeneralRepository.findProductsAllFromLatest();
  }

  async getProductsAllFromOldest(): Promise<ProductEntity[]> {
    return await this.productGeneralRepository.findProductsAllFromOldest();
  }

  async getProductByName(name: string): Promise<ProductEntity> {
    return await this.productGeneralRepository.findProductOneByName(name);
  }

  async getProductById(id: string): Promise<ProductEntity> {
    return await this.productGeneralRepository.findProductOneById(id);
  }

  async createProduct(
    createProductDto: CreateProductDto,
    imageCookie: MediaUrlCookieValue,
  ): Promise<void> {
    const [image, starRating] = await Promise.all([
      this.uploadRepository.findProductImageWithUrl(imageCookie.url),
      this.starRatingRepository.createStarRatingSample(),
    ]);

    await this.productGeneralRepository.createProduct(createProductDto);
    const product =
      await this.productGeneralRepository.findLastCreatedProduct();

    await Promise.all([
      this.uploadRepository.insertProductIdOnProductImage(image, product),
      this.starRatingRepository.insertProductIdOnStarRating(
        starRating,
        product,
      ),
    ]);
  }

  async findProductAndImageForModify(
    id: string,
    imageCookie: MediaUrlCookieValue,
  ): Promise<[ProductEntity, ProductImageEntity, ProductImageEntity]> {
    return await Promise.all([
      this.productGeneralRepository.findProductOneById(id),
      this.uploadRepository.findProductImageWithUrl(imageCookie.url),
      this.uploadRepository.findProductImageEvenUse(id),
    ]);
  }

  async modifyProduct(
    id: string,
    modifyProductDto: ModifyProductDto,
    imageCookie: MediaUrlCookieValue,
  ): Promise<void> {
    const [product, newImage, oldImage] =
      await this.findProductAndImageForModify(id, imageCookie);

    await Promise.all([
      this.uploadRepository.deleteProductImageWithId(oldImage.id),
      this.uploadRepository.insertProductIdOnProductImage(newImage, product),
      this.productGeneralRepository.modifyProduct(id, modifyProductDto),
    ]);
  }

  async modifyProductImage(id: string, imageCookie: MediaUrlCookieValue) {
    const [product, newImage, oldImage] =
      await this.findProductAndImageForModify(id, imageCookie);

    await Promise.all([
      this.uploadRepository.deleteProductImageWithId(oldImage.id),
      this.uploadRepository.insertProductIdOnProductImage(newImage, product),
    ]);
  }

  async modifyProductName(id: string, name: string): Promise<void> {
    await this.productGeneralRepository.modifyProductName(id, name);
  }

  async modifyProductPrice(id: string, price: string): Promise<void> {
    await this.productGeneralRepository.modifyProductPrice(id, price);
  }

  async modifyProductOrigin(id: string, origin: string): Promise<void> {
    await this.productGeneralRepository.modifyProductOrigin(id, origin);
  }

  async modifyProductType(id: string, type: string): Promise<void> {
    await this.productGeneralRepository.modifyProductType(id, type);
  }

  async modifyProductDescription(
    id: string,
    description: string,
  ): Promise<void> {
    await this.productGeneralRepository.modifyProductDescription(
      id,
      description,
    );
  }

  async modifyProductQuantity(id: string, quantity: string): Promise<void> {
    await this.productGeneralRepository.modifyProductQuantity(id, quantity);
  }

  async removeProduct(id: string): Promise<void> {
    await this.productGeneralRepository.removeProduct(id);
  }
}
