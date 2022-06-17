import { ProductRepository } from "./../product.repository";
import { Injectable, HttpException, NotFoundException } from "@nestjs/common";
import { CreateProductDto } from "../dto/create_product.dto";
import { ModifyProductDto } from "../dto/modify_product.dto";
import { ProductEntity } from "../product.entity";

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async getProductsAll(): Promise<ProductEntity[]> {
    const products = await this.productRepository.findProductsAll();

    if (!products.length) {
      throw new NotFoundException("데이터베이스에 상품이 존재하지 않습니다.");
    }

    return products;
  }

  async getProductByName(name: string): Promise<ProductEntity> {
    return await this.productRepository.findProductOneByName(name);
  }

  async getProductById(id: string): Promise<ProductEntity> {
    return await this.productRepository.findProductOneById(id);
  }

  async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    return await this.productRepository.createProduct(createProductDto);
  }

  //   // 쿼리(상품 아이디)를 통해 상품을 부분 수정하는 서비스
  //   modifyProduct(id: number, modifyProductDto: ModifyProductDto): Json {
  //     const { name, price, origin, type, description } = modifyProductDto;
  //     const found: Product = this.findProductByIdOrName(id);

  //     if (!found) {
  //       throw new HttpException(
  //         `Fail to modify product, ${id} is not exist`,
  //         404,
  //       );
  //     }

  //     const idx = this.products.indexOf(found);
  //     this.products[idx].name = name;
  //     this.products[idx].price = price;
  //     this.products[idx].origin = origin;
  //     this.products[idx].type = type;
  //     this.products[idx].description = description;

  //     return {
  //       statusCode: 200,
  //       success: true,
  //       message: `modify product by id ${id}`,
  //       result: found,
  //     };
  //   }

  //   // 쿼리(상품 아이디)를 통해 상품을 삭제하는 서비스
  //   removeProduct(id: number): Json {
  //     const found: Product = this.findProductByIdOrName(id);

  //     if (!found) {
  //       throw new HttpException(
  //         `Fail to remove product, ${id} is not exist`,
  //         404,
  //       );
  //     }

  //     this.products = this.products.filter((product) => product.id !== id);

  //     return {
  //       statusCode: 200,
  //       success: true,
  //       message: `remove product by id ${id}`,
  //     };
  //   }
}
