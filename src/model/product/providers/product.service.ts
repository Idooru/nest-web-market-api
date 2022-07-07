import { StarRatingRepository } from "./../../review/providers/star-rating.repository";
import { UploadService } from "src/model/upload/providers/upload.service";
import { ProductEntity } from "../entities/product.entity";
import { Promises } from "src/model/etc/providers/promises";
import { UploadRepository } from "../../upload/providers/upload.repository";
import { ProductRepository } from "./product.repository";
import { Injectable } from "@nestjs/common";
import { CreateProductDto } from "../dto/create_product.dto";
import { ModifyProductDto } from "../dto/modify_product.dto";
import { UserRepository } from "../../user/providers/user.repository";
import { ImagesEntity } from "src/model/upload/entities/upload.entity";

@Injectable()
export class ProductService {
  constructor(
    private readonly promises: Promises,
    private readonly productRepository: ProductRepository,
    private readonly userRepository: UserRepository,
    private readonly uploadService: UploadService,
    private readonly uploadRepository: UploadRepository,
    private readonly starRatingRepository: StarRatingRepository,
  ) {}

  async getProductsAllFromLatest(): Promise<ProductEntity[]> {
    return await this.productRepository.findProductsAllFromLatest();
  }

  async getProductsAllFromOldest(): Promise<ProductEntity[]> {
    return await this.productRepository.findProductsAllFromOldest();
  }

  async getProductByName(name: string): Promise<ProductEntity> {
    return await this.productRepository.findProductOneByName(name);
  }

  async getProductById(id: string): Promise<ProductEntity> {
    return await this.productRepository.findProductOneById(id);
  }

  async createProduct(
    createProductDto: CreateProductDto,
    creater: string,
    image?: string,
  ): Promise<void> {
    const { name } = createProductDto;
    let getImage: ImagesEntity;

    if (!image) {
      const result = await this.uploadService.copyImageFromImagePreparation(
        creater,
      );
      getImage = await this.uploadRepository.findImageWithUrl(result.url);
    } else {
      getImage = await this.uploadRepository.findImageWithUrl(image);
    }

    const madeStarRating = await this.starRatingRepository.createRating();
    const starRating = await this.starRatingRepository.findStarRatingWithId(
      madeStarRating.id,
    );

    createProductDto.image = getImage;
    createProductDto.starRating = starRating;

    await this.productRepository.checkProductNameToCreate(name);
    await this.productRepository.createProduct(createProductDto);
  }

  async modifyProduct(
    id: string,
    modifyProductDto: ModifyProductDto,
    modifier: string,
    image?: string,
  ): Promise<void> {
    const { name } = modifyProductDto;
    let getImage: ImagesEntity;

    const findProductAndImageId = await Promise.allSettled([
      this.productRepository.findProductOneById(id),
      this.uploadRepository.findImageWithUrl(image),
    ]);

    const findProductAndImageIdResult = this.promises.twoPromiseSettled(
      findProductAndImageId[0],
      findProductAndImageId[1],
      "Find Product And ImageId",
    );

    const [product, haveImage] = findProductAndImageIdResult;

    if (!haveImage) {
      const result = await this.uploadService.copyImageFromImagePreparation(
        modifier,
      );
      getImage = await this.uploadRepository.findImageWithUrl(result.url);
    } else {
      getImage = await this.uploadRepository.findImageWithUrl(haveImage.url);
    }

    modifyProductDto.image = getImage;

    await this.productRepository.checkProductNameToModify(name, product.name);
    await this.productRepository.modifyProduct(id, modifyProductDto);
  }

  async removeProduct(id: string): Promise<void> {
    await this.productRepository.removeProduct(id);
  }
}
