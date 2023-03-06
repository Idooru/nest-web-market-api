import { StarRateRepository } from "../../review/repositories/star-rate-general.repository";
import { ProductEntity } from "../entities/product.entity";
import { ProductGeneralRepository } from "../repositories/product-general.repository";
import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateProductDto } from "../dto/create_product.dto";
import { ModifyProductDto } from "../dto/modify_product.dto";
import { ReceiveMediaDto } from "src/model/media/dto/receive-media.dto";
import { ProductImageEntity } from "src/model/media/entities/product.image.entity";
import { MediaGeneralRepository } from "src/model/media/repositories/media-general.repository";

@Injectable()
export class ProductGeneralService {
  constructor(
    private readonly productGeneralRepository: ProductGeneralRepository,
    private readonly mediaGeneralRepository: MediaGeneralRepository,
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

  async findAllProductsFromLatest(): Promise<ProductEntity[]> {
    const founds =
      await this.productGeneralRepository.findAllProductsFromLatest();
    this.isExistProducts(founds);
    return founds;
  }

  async findAllProductsFromOldest(): Promise<ProductEntity[]> {
    const founds =
      await this.productGeneralRepository.findAllProductsFromOldest();
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
    imageCookie: ReceiveMediaDto,
  ): Promise<void> {
    const [image, StarRate] = await Promise.all([
      this.mediaGeneralRepository.findProductImageWithUrl(imageCookie.url),
      this.starRateRepository.createStarRateSample(),
    ]);

    await this.productGeneralRepository.createProduct(createProductDto);
    const product =
      await this.productGeneralRepository.findLastCreatedProduct();

    await Promise.all([
      this.mediaGeneralRepository.insertProductIdOnProductImage(image, product),
      this.starRateRepository.insertProductIdOnStarRate(StarRate, product),
    ]);
  }

  async findProductAndImageForModify(
    id: string,
    imageCookie: ReceiveMediaDto,
  ): Promise<[ProductEntity, ProductImageEntity, ProductImageEntity]> {
    return await Promise.all([
      this.productGeneralRepository.findProductOneById(id),
      this.mediaGeneralRepository.findProductImageWithUrl(imageCookie.url),
      this.mediaGeneralRepository.findProductImageEvenUse(id),
    ]);
  }

  async modifyProduct(
    id: string,
    modifyProductDto: ModifyProductDto,
    imageCookie: ReceiveMediaDto,
  ): Promise<void> {
    const [product, newImage, evenImage] =
      await this.findProductAndImageForModify(id, imageCookie);

    await Promise.all([
      this.mediaGeneralRepository.deleteProductImageWithId(evenImage.id),
      this.mediaGeneralRepository.insertProductIdOnProductImage(
        newImage,
        product,
      ),
      this.productGeneralRepository.modifyProduct(id, modifyProductDto),
    ]);
  }

  async modifyProductImage(id: string, imageCookie: ReceiveMediaDto) {
    const [product, newImage, evenImage] =
      await this.findProductAndImageForModify(id, imageCookie);

    await Promise.all([
      this.mediaGeneralRepository.deleteProductImageWithId(evenImage.id),
      this.mediaGeneralRepository.insertProductIdOnProductImage(
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
