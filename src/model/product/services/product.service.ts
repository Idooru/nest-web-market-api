import { UploadRepository } from "./../../upload/upload.repository";
import {
  ProductReturnFilter,
  ProductsReturnFilter,
  ResponseProductsDto,
  ResponseProductDto,
} from "./../dto/response_product.dto";
import { ProductRepository } from "./../product.repository";
import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateProductDto } from "../dto/create_product.dto";
import { ModifyProductDto } from "../dto/modify_product.dto";

@Injectable()
export class ProductService {
  constructor(
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
    const imageId = await this.uploadRepository.findImageIdWithImageFileName(
      image,
    );

    createProductDto.image = imageId;

    await this.productRepository.checkProductNameToCreate(name);
    await this.productRepository.createProduct(createProductDto);
  }

  async modifyProduct(
    id: string,
    modifyProductDto: ModifyProductDto,
  ): Promise<void> {
    const { name, image } = modifyProductDto;
    const product = await this.productRepository.findProductOneById(id);
    const imageId = await this.uploadRepository.findImageIdWithImageFileName(
      image,
    );

    modifyProductDto.image = imageId;

    await this.productRepository.checkProductNameToModify(name, product.name);
    await this.productRepository.modifyProduct(id, modifyProductDto);
  }

  async removeProduct(id: string): Promise<void> {
    await this.productRepository.removeProduct(id);
  }
}
