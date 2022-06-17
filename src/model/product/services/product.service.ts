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
  constructor(private readonly productRepository: ProductRepository) {}

  private readonly productReturnFilter = ProductReturnFilter;
  private readonly productsReturnFilter = ProductsReturnFilter;

  async getProductsAllFromLatest(): Promise<ResponseProductsDto[]> {
    const products = await this.productRepository.findProductsAllFromLatest();

    if (!products.length) {
      throw new NotFoundException("데이터베이스에 상품이 존재하지 않습니다.");
    }

    return this.productsReturnFilter(products);
  }

  async getProductsAllFromOldest(): Promise<ResponseProductsDto[]> {
    const products = await this.productRepository.findProductsAllFromOldest();

    if (!products.length) {
      throw new NotFoundException("데이터베이스에 상품이 존재하지 않습니다.");
    }

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
    const { name } = createProductDto;
    await this.productRepository.checkProductNameToExist(name);
    await this.productRepository.createProduct(createProductDto);
  }

  async modifyProduct(
    id: string,
    modifyProductDto: ModifyProductDto,
  ): Promise<void> {
    const { name } = modifyProductDto;
    await this.productRepository.checkProductIdToExist(id);
    await this.productRepository.checkProductNameToExist(name);
    await this.productRepository.modifyProduct(id, modifyProductDto);
  }

  async removeProduct(id: string): Promise<void> {
    await this.productRepository.removeProduct(id);
  }
}
