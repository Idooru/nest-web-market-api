import { ProductEntity } from "./../product.entity";
import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Query,
  Patch,
  Delete,
  ParseIntPipe,
} from "@nestjs/common";
import { ProductService } from "../services/product.service";
import { JSON } from "../../../common/interfaces/json.interface";
import { CreateProductDto } from "../dto/create_product.dto";
import { ModifyProductDto } from "../dto/modify_product.dto";

@Controller("/product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get("/")
  async getProductAll(): Promise<JSON<ProductEntity[]>> {
    return {
      statusCode: 200,
      message: "전체 상품 정보를 가져옵니다.",
      result: await this.productService.getProductsAll(),
    };
  }

  @Get("/qn")
  async getProductByName(
    @Query("name") name: string,
  ): Promise<JSON<ProductEntity>> {
    return {
      statusCode: 200,
      message: `${name}에 해당하는 상품 정보를 가져옵니다.`,
      result: await this.productService.getProductByName(name),
    };
  }

  @Get("/qi")
  async getProductById(@Query("id") id: string): Promise<JSON<ProductEntity>> {
    return {
      statusCode: 200,
      message: `${id}에 해당하는 상품 정보를 가져옵니다.`,
      result: await this.productService.getProductById(id),
    };
  }

  @Post("/")
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<JSON<void>> {
    await this.productService.createProduct(createProductDto);

    return {
      statusCode: 201,
      message: "상품을 생성하였습니다.",
    };
  }

  // @Patch("/qi")
  // modifyProduct(
  //   @Query("id") id: string,
  //   @Body() modifyProductDto: ModifyProductDto,
  // ): Promise<JSON<ProductEntit>> {
  //   return this.productService.modifyProduct(id, modifyProductDto);
  // }

  // @Delete("/qi")
  // removeProduct(@Query("id") id: number): JSON {
  //   return this.productService.removeProduct(id);
  // }
}
