import { ProductsImageEntity } from "./../../upload/entities/product.image.entity";
import { StarRatingRepository } from "./../../review/providers/star-rating.repository";
import { UploadService } from "src/model/upload/providers/upload.service";
import { ProductsEntity } from "../entities/product.entity";
import { Promises } from "../../../common/config/etc/providers/promises";
import { UploadRepository } from "../../upload/providers/upload.repository";
import { ProductRepository } from "./product.repository";
import { Injectable } from "@nestjs/common";
import { CreateProductDto } from "../dto/create_product.dto";
import { ModifyProductDto } from "../dto/modify_product.dto";
import { MediaUrlCookie } from "src/common/interfaces/media.url.cookie.interface";
import { ReviewRepository } from "../../review/providers/review.repository";
import { InquiryRepository } from "src/model/inquiry/providers/inquiry.repository";

@Injectable()
export class ProductService {
  constructor(
    private readonly promises: Promises,
    private readonly productRepository: ProductRepository,
    private readonly uploadService: UploadService,
    private readonly uploadRepository: UploadRepository,
    private readonly starRatingRepository: StarRatingRepository,
  ) {}

  async getProductsAllFromLatest(): Promise<ProductsEntity[]> {
    return await this.productRepository.findProductsAllFromLatest();
  }

  async getProductsAllFromOldest(): Promise<ProductsEntity[]> {
    return await this.productRepository.findProductsAllFromOldest();
  }

  async getProductByName(name: string): Promise<ProductsEntity> {
    return await this.productRepository.findProductOneByName(name);
  }

  async getProductById(id: string): Promise<ProductsEntity> {
    return await this.productRepository.findProductOneById(id);
  }

  async createProduct(
    createProductDto: CreateProductDto,
    creater: string,
    imageCookie: MediaUrlCookie,
  ): Promise<void> {
    const { name } = createProductDto;
    let image: ProductsImageEntity;

    if (!imageCookie) {
      const result = await this.uploadService.copyImageFromImagePreparation(
        creater,
      );
      image = await this.uploadRepository.findProductImageWithUrl(result.url);
    } else {
      image = await this.uploadRepository.findProductImageWithUrl(
        imageCookie.url,
      );
    }

    const starRating = await this.starRatingRepository.createStarRatingSample();

    createProductDto.Image = image;
    createProductDto.StarRating = starRating;

    await this.productRepository.checkProductNameToCreate(name);
    await this.productRepository.createProduct(createProductDto);
  }

  async modifyProduct(
    productId: string,
    modifyProductDto: ModifyProductDto,
    modifier: string,
    imageCookie: MediaUrlCookie,
  ): Promise<void> {
    const { name } = modifyProductDto;
    let getImage: ProductsImageEntity;

    const findProductAndImageId = await Promise.allSettled([
      this.productRepository.findProductOneById(productId),
      this.uploadRepository.findProductImageWithUrl(imageCookie.url),
    ]);

    const findProductAndImageIdResult = this.promises.twoPromiseSettled(
      findProductAndImageId[0],
      findProductAndImageId[1],
      "Find Product And ImageId",
    );

    const [product, image] = findProductAndImageIdResult;

    if (!image) {
      const result = await this.uploadService.copyImageFromImagePreparation(
        modifier,
      );
      getImage = await this.uploadRepository.findProductImageWithUrl(
        result.url,
      );
    } else {
      getImage = await this.uploadRepository.findProductImageWithUrl(image.url);
    }

    modifyProductDto.Image = getImage;

    await this.productRepository.checkProductNameToModify(name, product.name);
    await this.productRepository.modifyProduct(productId, modifyProductDto);
  }

  async removeProduct(id: string): Promise<void> {
    await this.productRepository.removeProduct(id);
  }
}
