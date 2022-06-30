import { UploadService } from "src/model/upload/services/upload.service";
import { ProductEntity } from "./../product.entity";
import { Functions } from "src/model/etc/providers/functions";
import { UploadRepository } from "./../../upload/upload.repository";
import { ProductRepository } from "./../product.repository";
import { Injectable } from "@nestjs/common";
import { CreateProductDto } from "../dto/create_product.dto";
import { ModifyProductDto } from "../dto/modify_product.dto";
import { UserRepository } from "src/model/user/user.repository";
import { ImagesEntity } from "src/model/upload/entities/upload.entity";

@Injectable()
export class ProductService {
  constructor(
    private readonly functions: Functions,
    private readonly productRepository: ProductRepository,
    private readonly userRepository: UserRepository,
    private readonly uploadService: UploadService,
    private readonly uploadRepository: UploadRepository,
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
    image: string | null,
  ): Promise<void> {
    const { name } = createProductDto;
    let getImage: ImagesEntity;

    if (!image) {
      const result =
        await this.uploadService.copyImageFromProductImagePreparation(creater);
      getImage = await this.uploadRepository.findImageWithUrl(result.url);
    } else {
      getImage = await this.uploadRepository.findImageWithUrl(image);
    }

    createProductDto.image = getImage;

    await this.productRepository.checkProductNameToCreate(name);
    await this.productRepository.createProduct(createProductDto);
  }

  async modifyProduct(
    id: string,
    modifyProductDto: ModifyProductDto,
    modifier: string,
    image: string | null,
  ): Promise<void> {
    const { name } = modifyProductDto;
    let getImage: ImagesEntity;

    const findProductAndImageId = await Promise.allSettled([
      this.productRepository.findProductOneById(id),
      this.uploadRepository.findImageWithUrl(image),
    ]);

    const findProductAndImageIdResult = this.functions.promiseSettledProcess(
      findProductAndImageId,
      "Find Product And ImageId",
    );

    const [product, haveImage] = findProductAndImageIdResult.map(
      (idx) => idx.value,
    );

    if (!haveImage) {
      const result =
        await this.uploadService.copyImageFromProductImagePreparation(modifier);
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
