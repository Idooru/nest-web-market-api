import { StarRateGeneralRepository } from "../../review/repositories/star-rate-general.repository";
import { ProductEntity } from "../entities/product.entity";
import { ProductGeneralRepository } from "../repositories/product-general.repository";
import { Injectable } from "@nestjs/common";
import { CreateProductDto } from "../dto/create-product.dto";
import { ModifyProductDto } from "../dto/modify-product.dto";
import { MediaGeneralRepository } from "src/model/media/repositories/media-general.repository";
import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { UserGeneralRepository } from "src/model/user/repositories/user-general.repository";
import { MediaInsertRepository } from "src/model/media/repositories/media-insert.repository";
import { StarRateInsertRepository } from "src/model/review/repositories/star-rate-insert.repository";
import { ProductInsertRepository } from "../repositories/product-insert.repository";
import { ProductAccessoryService } from "./product-accessory.service";
import { MediaDto } from "src/model/media/dto/media.dto";
import { IProductGeneralService } from "../interfaces/services/product-general-service.interface";

@Injectable()
export class ProductGeneralService implements IProductGeneralService {
  constructor(
    private readonly productGeneralRepository: ProductGeneralRepository,
    private readonly mediaGeneralRepository: MediaGeneralRepository,
    private readonly starRateRepository: StarRateGeneralRepository,
    private readonly userGeneralRepository: UserGeneralRepository,
    private readonly productInsertRepository: ProductInsertRepository,
    private readonly mediaInsertRepository: MediaInsertRepository,
    private readonly starRateInsertRepository: StarRateInsertRepository,
    private readonly productAccessoryService: ProductAccessoryService,
  ) {}

  async findAllProductsFromLatest(): Promise<ProductEntity[]> {
    const founds =
      await this.productGeneralRepository.findAllProductsFromLatest();
    this.productAccessoryService.isExistProducts(founds);
    return founds;
  }

  async findAllProductsFromOldest(): Promise<ProductEntity[]> {
    const founds =
      await this.productGeneralRepository.findAllProductsFromOldest();
    this.productAccessoryService.isExistProducts(founds);
    return founds;
  }

  async findProductByName(name: string): Promise<ProductEntity> {
    return await this.productGeneralRepository.findOneProductByName(name);
  }

  async findProductById(id: string): Promise<ProductEntity> {
    return await this.productGeneralRepository.findOneProductById(id);
  }

  async createProduct(
    createProductDto: CreateProductDto,
    imageCookie: MediaDto,
    jwtPayload: JwtAccessTokenPayload,
  ): Promise<void> {
    const [image, StarRate, admin] = await Promise.all([
      this.mediaGeneralRepository.findProductImageWithUrl(imageCookie.url),
      this.starRateRepository.createStarRateSample(),
      this.userGeneralRepository.findAdminUserObjectWithId(jwtPayload.userId),
    ]);

    const productOutput = await this.productGeneralRepository.createProduct(
      createProductDto,
      admin,
    );

    const productId: string = productOutput.generatedMaps[0].id;

    const product = await this.productInsertRepository.findOneProductById(
      productId,
    );

    await Promise.all([
      this.mediaInsertRepository.insertProductIdOnProductImage(image, product),
      this.starRateInsertRepository.insertProductIdOnStarRate(
        StarRate,
        product,
      ),
    ]);
  }

  async modifyProduct(
    id: string,
    modifyProductDto: ModifyProductDto,
    imageCookie: MediaDto,
  ): Promise<void> {
    const [product, newImage, evenImage] =
      await this.productAccessoryService.findProductAndImageForModify(
        id,
        imageCookie,
      );

    await this.productGeneralRepository.modifyProduct(id, modifyProductDto);

    await Promise.all([
      this.mediaGeneralRepository.deleteProductImageWithId(evenImage.id),
      this.mediaInsertRepository.insertProductIdOnProductImage(
        newImage,
        product,
      ),
    ]);
  }

  async modifyProductImage(id: string, imageCookie: MediaDto) {
    const [product, newImage, evenImage] =
      await this.productAccessoryService.findProductAndImageForModify(
        id,
        imageCookie,
      );

    await Promise.all([
      this.mediaGeneralRepository.deleteProductImageWithId(evenImage.id),
      this.mediaInsertRepository.insertProductIdOnProductImage(
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
