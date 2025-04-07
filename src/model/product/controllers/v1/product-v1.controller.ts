import { Controller, Get, UseInterceptors, Param, Query } from "@nestjs/common";
import { JsonGeneralInterceptor } from "src/common/interceptors/general/json-general.interceptor";
import { JsonGeneralInterface } from "src/common/interceptors/interface/json-general-interface";
import { ApiTags } from "@nestjs/swagger";
import { ProductSearcher } from "../../logic/product.searcher";
import { ProductIdValidatePipe } from "../../pipe/exist/product-id-validate.pipe";
import { FindProductWithIdSwagger } from "../../docs/product-v1-controller/find-product-with-id.swagger";
import { ProductBasicRawDto } from "../../dto/response/product-basic-raw.dto";
import { ProductDetailRawDto } from "../../dto/response/product-detail-raw.dto";
import { FindAllProductsDto } from "../../dto/request/find-all-products.dto";

@ApiTags("v1 공용 Product API")
@Controller({ path: "/product", version: "1" })
export class ProductV1Controller {
  constructor(private readonly productSearcher: ProductSearcher) {}

  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/all")
  public async findAllProducts(
    @Query() query: FindAllProductsDto,
  ): Promise<JsonGeneralInterface<ProductBasicRawDto[]>> {
    const result = await this.productSearcher.findAllRaws(query);

    return {
      statusCode: 200,
      message: "query 조건에 해당하는 전체 상품 정보를 가져옵니다.",
      result,
    };
  }

  @FindProductWithIdSwagger()
  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/:productId")
  public async findDetailProduct(
    @Param("productId", ProductIdValidatePipe) productId: string,
  ): Promise<JsonGeneralInterface<ProductDetailRawDto>> {
    const result = await this.productSearcher.findDetailRaw(productId);

    return {
      statusCode: 200,
      message: `${productId}에 해당하는 상품 정보를 가져옵니다.`,
      result,
    };
  }
}
