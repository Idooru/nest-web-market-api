import { Controller, Get, UseInterceptors, Param } from "@nestjs/common";
import { ProductEntity } from "../../entities/product.entity";
import { JsonGeneralInterceptor } from "src/common/interceptors/general/json-general.interceptor";
import { JsonGeneralInterface } from "src/common/interceptors/interface/json-general-interface";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ProductSearcher } from "../../logic/product.searcher";
import { AccessProductNameDto } from "../../dto/access_product_name.dto";
import { ProductIdValidatePipe } from "../../pipe/exist/product-id-validate.pipe";

@ApiTags("v1 공용 Product API")
@Controller({ path: "/product", version: "1" })
export class ProductV1Controller {
  constructor(private readonly searcher: ProductSearcher) {}

  @ApiOperation({
    summary: "find all products from latest",
    description: "전체 상품 정보를 최신 순서로 가져옵니다. 상품 배열의 길이가 0일 경우 에러를 반환합니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/")
  public async findAllProductsFromLatest(): Promise<JsonGeneralInterface<ProductEntity[]>> {
    const result = await this.searcher.findAllProductsFromLatest();

    return {
      statusCode: 200,
      message: "전체 상품 정보를 최신 순서로 가져옵니다.",
      result,
    };
  }

  @ApiOperation({
    summary: "find all products from oldest",
    description: "전체 상품 정보를 오래된 순서로 가져옵니다. 상품 배열의 길이가 0일 경우 에러를 반환합니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/oldest")
  public async findAllProductsFromOldest(): Promise<JsonGeneralInterface<ProductEntity[]>> {
    const result = await this.searcher.findAllProductsFromOldest();

    return {
      statusCode: 200,
      message: "전체 상품 정보를 오래된 순서로 가져옵니다.",
      result,
    };
  }

  @ApiOperation({
    summary: "find product by name",
    description:
      "상품의 이름에 해당하는 상품 정보를 가져옵니다. 상품의 이름과 일치하는 row가 데이터베이스에 존재하지 않을 경우 에러를 반환합니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/name/:name")
  public async findProductByName(
    @Param() { name }: AccessProductNameDto,
  ): Promise<JsonGeneralInterface<ProductEntity[]>> {
    const result = await this.searcher.findProductWithName(name);

    return {
      statusCode: 200,
      message: `이름이 ${name}에 해당하는 상품 정보를 가져옵니다.`,
      result,
    };
  }

  @ApiOperation({
    summary: "find product by productId",
    description:
      "상품의 아이디에 해당하는 상품 정보를 가져옵니다. 상품의 아이디와 일치하는 row가 데이터베이스에 존재하지 않을 경우 에러를 반환합니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/product-id/:productId")
  public async findProductWithId(
    @Param("productId", ProductIdValidatePipe) productId: string,
  ): Promise<JsonGeneralInterface<ProductEntity>> {
    const result = await this.searcher.findProductWithId(productId);

    return {
      statusCode: 200,
      message: `${productId}에 해당하는 상품 정보를 가져옵니다.`,
      result,
    };
  }
}
