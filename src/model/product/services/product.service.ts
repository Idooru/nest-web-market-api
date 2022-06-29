import { ProductEntity } from "./../product.entity";
import { Functions } from "src/model/etc/providers/functions";
import { UploadRepository } from "./../../upload/upload.repository";
import { ProductRepository } from "./../product.repository";
import { Injectable } from "@nestjs/common";
import { CreateProductDto } from "../dto/create_product.dto";
import { ModifyProductDto } from "../dto/modify_product.dto";
import { UserRepository } from "src/model/user/user.repository";

import * as fs from "fs";
import * as path from "path";

@Injectable()
export class ProductService {
  constructor(
    private readonly functions: Functions,
    private readonly productRepository: ProductRepository,
    private readonly userRepository: UserRepository,
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
  ): Promise<void> {
    const { name, image } = createProductDto;

    if (!image) {
      const uploader = await this.userRepository.findUserAuthWithNickName(
        creater,
      );

      // const url = fs.readFileSync(
      //   path.join(
      //     __dirname,
      //     "../../../../uploads/image/readyForProductImage-1656458823374.jpg",
      //   ),
      // );

      // const stringUrl = url.toString();

      const { name } = await this.uploadRepository.uploadImageForProduct({
        url: "readyForProductImage-1656458823374.jpg",
        uploader,
      });

      console.log(name);
    }

    const getImage = await this.uploadRepository.findImageWithUploadedImage(
      image,
    );

    createProductDto.image = getImage;

    const checkProductNameAndCreate = await Promise.allSettled([
      this.productRepository.checkProductNameToCreate(name),
      this.productRepository.createProduct(createProductDto),
    ]);

    this.functions.promiseSettledProcess(
      checkProductNameAndCreate,
      "Check Product Name And Create",
    );
  }

  async modifyProduct(
    id: string,
    modifyProductDto: ModifyProductDto,
  ): Promise<void> {
    const { name, image } = modifyProductDto;

    const findProductAndImageId = await Promise.allSettled([
      this.productRepository.findProductOneById(id),
      this.uploadRepository.findImageWithUploadedImage(image),
    ]);

    const findProductAndImageIdResult = this.functions.promiseSettledProcess(
      findProductAndImageId,
      "Find Product And ImageId",
    );

    const [product, imageId] = findProductAndImageIdResult.map(
      (idx) => idx.value,
    );

    modifyProductDto.image = imageId;

    const checkAndModify = await Promise.allSettled([
      this.productRepository.checkProductNameToModify(name, product.name),
      this.productRepository.modifyProduct(id, modifyProductDto),
    ]);

    this.functions.promiseSettledProcess(
      checkAndModify,
      "Check Product Name And Modify Product",
    );
  }

  async removeProduct(id: string): Promise<void> {
    await this.productRepository.removeProduct(id);
  }
}
