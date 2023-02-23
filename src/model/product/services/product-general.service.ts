import { StarRateRepository } from "../../review/repositories/star-rate-general.repository";
import { ProductEntity } from "../entities/product.entity";
import { ProductGeneralRepository } from "../repositories/product-general.repository";
import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateProductDto } from "../dto/create_product.dto";
import { ModifyProductDto } from "../dto/modify_product.dto";
import { MediaReceiveDto } from "src/model/upload/dto/media-receive.dto";
import { ProductImageEntity } from "src/model/upload/entities/product.image.entity";
import { UploadGeneralRepository } from "src/model/upload/repositories/upload-general.repository";

@Injectable()
export class ProductGeneralService {
  constructor(
    private readonly productGeneralRepository: ProductGeneralRepository,
    private readonly uploadGeneralRepository: UploadGeneralRepository,
    private readonly starRateRepository: StarRateRepository,
  ) {}

  isExistProducts(founds: ProductEntity[]): void {
    if (!founds.length) {
      throw new NotFoundException("데이터베이스에 상품이 존재하지 않습니다.");
    }
  }

  async findProductsAllId(): Promise<ProductEntity[]> {
    const founds = await this.productGeneralRepository.findProductsAllId();
    this.isExistProducts(founds);
    return founds;
  }

  async findProductsAllFromLatest(): Promise<ProductEntity[]> {
    const founds =
      await this.productGeneralRepository.findProductsAllFromLatest();
    this.isExistProducts(founds);
    return founds;
  }

  async findProductsAllFromOldest(): Promise<ProductEntity[]> {
    const founds =
      await this.productGeneralRepository.findProductsAllFromOldest();
    this.isExistProducts(founds);
    return founds;
  }

  async findProductByName(name: string): Promise<ProductEntity> {
    return await this.productGeneralRepository.findProductOneByName(name);
  }

  async findProductById(id: string): Promise<ProductEntity> {
    return await this.productGeneralRepository.findProductOneById(id);
  }

  async createProduct(
    createProductDto: CreateProductDto,
    imageCookie: MediaReceiveDto,
  ): Promise<void> {
    const [image, StarRate] = await Promise.all([
      this.uploadGeneralRepository.findProductImageWithUrl(imageCookie.url),
      this.starRateRepository.createStarRateSample(),
    ]);

    await this.productGeneralRepository.createProduct(createProductDto);
    const product =
      await this.productGeneralRepository.findLastCreatedProduct();

    await Promise.all([
      this.uploadGeneralRepository.insertProductIdOnProductImage(
        image,
        product,
      ),
      this.starRateRepository.insertProductIdOnStarRate(StarRate, product),
    ]);
  }

  async findProductAndImageForModify(
    id: string,
    imageCookie: MediaReceiveDto,
  ): Promise<[ProductEntity, ProductImageEntity, ProductImageEntity]> {
    return await Promise.all([
      this.productGeneralRepository.findProductOneById(id),
      this.uploadGeneralRepository.findProductImageWithUrl(imageCookie.url),
      this.uploadGeneralRepository.findProductImageEvenUse(id),
    ]);
  }

  async modifyProduct(
    id: string,
    modifyProductDto: ModifyProductDto,
    imageCookie: MediaReceiveDto,
  ): Promise<void> {
    const [product, newImage, evenImage] =
      await this.findProductAndImageForModify(id, imageCookie);

    await Promise.all([
      this.uploadGeneralRepository.deleteProductImageWithId(evenImage.id),
      this.uploadGeneralRepository.insertProductIdOnProductImage(
        newImage,
        product,
      ),
      this.productGeneralRepository.modifyProduct(id, modifyProductDto),
    ]);
  }

  async modifyProductImage(id: string, imageCookie: MediaReceiveDto) {
    const [product, newImage, evenImage] =
      await this.findProductAndImageForModify(id, imageCookie);

    await Promise.all([
      this.uploadGeneralRepository.deleteProductImageWithId(evenImage.id),
      this.uploadGeneralRepository.insertProductIdOnProductImage(
        newImage,
        product,
      ),
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
