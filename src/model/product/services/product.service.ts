import { Functions } from "src/model/etc/providers/functions";
import { UploadRepository } from "./../../upload/upload.repository";
import {
  ProductReturnFilter,
  ProductsReturnFilter,
  ResponseProductsDto,
  ResponseProductDto,
} from "./../dto/response_product.dto";
import { ProductRepository } from "./../product.repository";
import { Injectable } from "@nestjs/common";
import { CreateProductDto } from "../dto/create_product.dto";
import { ModifyProductDto } from "../dto/modify_product.dto";

@Injectable()
export class ProductService {
  constructor(
    private readonly functions: Functions,
    private readonly productRepository: ProductRepository,
    private readonly uploadRepository: UploadRepository,
  ) {}

  private readonly productReturnFilter = ProductReturnFilter;
  private readonly productsReturnFilter = ProductsReturnFilter;

  async getProductsAllFromLatest(): Promise<ResponseProductsDto[]> {
    const products = await this.productRepository.findProductsAllFromLatest();
    return this.productsReturnFilter(products);
  }

  async getProductsAllFromOldest(): Promise<ResponseProductsDto[]> {
    const products = await this.productRepository.findProductsAllFromOldest();
    return this.productsReturnFilter(products);
  }

  async getProductByName(name: string): Promise<ResponseProductDto> {
    const product = await this.productRepository.findProductOneByName(name);
    return this.productReturnFilter(product);
  }

  async getProductById(id: string): Promise<ResponseProductDto> {
    const product = await this.productRepository.findProductOneById(id);
    return this.productReturnFilter(product);
  }

  async createProduct(createProductDto: CreateProductDto): Promise<void> {
    const { name, image } = createProductDto;
    const imageId = await this.uploadRepository.findImageIdWithUploadedImage(
      image,
    );

    createProductDto.image = imageId;

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
      this.uploadRepository.findImageIdWithUploadedImage(image),
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
