import { Controller, Get, UseInterceptors, Query, Param } from "@nestjs/common";
import * as response_productDto from "../dto/response_product.dto";
import { ProductService } from "../providers/product.service";
import { JsonGeneralInterceptor } from "src/common/interceptors/json-general.interceptor";
import { JsonGeneralInterface } from "src/common/interceptors/interface/json-general-interface";

@Controller("/api/v1/free-use/product")
export class ProductVersionOneFreeUseController {
  constructor(private readonly productService: ProductService) {}

  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/")
  async getProductsAllFromLatest(): Promise<
    JsonGeneralInterface<response_productDto.ResponseProductsDto[]>
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
    JsonGeneralInterface<response_productDto.ResponseProductsDto[]>
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
  ): Promise<JsonGeneralInterface<response_productDto.ResponseProductDto>> {
    return {
      statusCode: 200,
      message: `${productName}에 해당하는 상품 정보를 가져옵니다.`,
      result: await this.productService.getProductByName(productName),
    };
  }

  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/id/:id")
  async getProductById(
    @Param("id") productId: string,
  ): Promise<JsonGeneralInterface<response_productDto.ResponseProductDto>> {
    return {
      statusCode: 200,
      message: `${productId}에 해당하는 상품 정보를 가져옵니다.`,
      result: await this.productService.getProductById(productId),
    };
  }
}
