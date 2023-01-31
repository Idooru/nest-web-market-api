import { Controller, Get, UseInterceptors, Param } from "@nestjs/common";
import { ProductService } from "../providers/product.service";
import { JsonGeneralInterceptor } from "src/common/interceptors/json-general.interceptor";
import { JsonGeneralInterface } from "src/common/interceptors/interface/json-general-interface";
import { ProductEntity } from "../entities/product.entity";

@Controller("/api/v1/free-use/product")
export class ProductVersionOneFreeUseController {
  constructor(private readonly productService: ProductService) {}

  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/")
  async getProductsAllFromLatest(): Promise<
    JsonGeneralInterface<ProductEntity[]>
  > {
    return {
      statusCode: 200,
      message: "전체 상품 정보를 최신 순서로 가져옵니다.",
      result: await this.productService.getProductsAllFromLatest(),
    };
  }

  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/oldest")
  async getProductsAllFromOldest(): Promise<
    JsonGeneralInterface<ProductEntity[]>
  > {
    return {
      statusCode: 200,
      message: "전체 상품 정보를 오래된 순서로 가져옵니다.",
      result: await this.productService.getProductsAllFromOldest(),
    };
  }

  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/name/:name")
  async getProductByName(
    @Param("name") productName: string,
  ): Promise<JsonGeneralInterface<ProductEntity>> {
    return {
      statusCode: 200,
      message: `${productName}에 해당하는 상품 정보를 가져옵니다.`,
      result: await this.productService.getProductByName(productName),
    };
  }
}
