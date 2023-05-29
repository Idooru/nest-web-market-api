import { Controller, Get, UseInterceptors, Param } from "@nestjs/common";
import { ProductGeneralService } from "../../services/product-general.service";
import { ProductEntity } from "../../entities/product.entity";
import { JsonGeneralInterceptor } from "src/common/interceptors/general/json-general.interceptor";
import { JsonGeneralInterface } from "src/common/interceptors/interface/json-general-interface";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("v1 공용 Product API")
@Controller("/api/v1/free-use/product")
export class ProductVersionOneFreeUseController {
  constructor(private readonly productGeneralService: ProductGeneralService) {}

  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/")
  async findAllProductsFromLatest(): Promise<
    JsonGeneralInterface<ProductEntity[]>
  > {
    return {
      statusCode: 200,
      message: "전체 상품 정보를 최신 순서로 가져옵니다.",
      result: await this.productGeneralService.findAllProductsFromLatest(),
    };
  }

  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/oldest")
  async findAllProductsFromOldest(): Promise<
    JsonGeneralInterface<ProductEntity[]>
  > {
    return {
      statusCode: 200,
      message: "전체 상품 정보를 오래된 순서로 가져옵니다.",
      result: await this.productGeneralService.findAllProductsFromOldest(),
    };
  }

  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/:name")
  async findProductByName(
    @Param("name") productName: string,
  ): Promise<JsonGeneralInterface<ProductEntity>> {
    return {
      statusCode: 200,
      message: `${productName}에 해당하는 상품 정보를 가져옵니다.`,
      result: await this.productGeneralService.findProductByName(productName),
    };
  }
}
