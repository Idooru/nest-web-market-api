import {
  Controller,
  Get,
  Inject,
  Param,
  UseInterceptors,
} from "@nestjs/common";
import { SendVerifyCookieInterceptor } from "src/common/interceptors/verify/send-verify-cookie.interceptor";
import { VerifyDataInterface } from "src/common/interceptors/interface/verify-data.dto";
import { ProductVerifyService } from "../../services/product-verify.service";
import { ProductVerifyCookieKey } from "src/common/config/cookie-key-configs/verify-cookie-keys/product-verify-cookie.key";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("v1 검증 Product API")
@Controller("/api/v1/verify/product")
export class ProductVersionOneVerfiyController {
  constructor(
    @Inject("ProductVerifyCookieKey")
    private readonly verfiy: ProductVerifyCookieKey,
    private readonly productVerifyService: ProductVerifyService,
  ) {}

  @ApiOperation({
    summary: "is exist product id",
    description:
      "파라미터로 받은 상품의 아이디가 데이터베이스에 존재하는지 검증합니다.",
  })
  @UseInterceptors(SendVerifyCookieInterceptor)
  @Get("/existent/id/:id")
  async isExistProductId(
    @Param("id") id: string,
  ): Promise<VerifyDataInterface> {
    await this.productVerifyService.isExistProductId(id);

    return {
      message:
        "해당 상품 아이디가 데이터베이스에 존재하는 것이 확인되었습니다.",
      setCookieKey: this.verfiy.is_exist.id_executed,
    };
  }

  @ApiOperation({
    summary: "is none exist product name",
    description:
      "파라미터로 받은 상품의 이름이 데이터베이스에 존재하지 않는지 검증합니다.",
  })
  @UseInterceptors(SendVerifyCookieInterceptor)
  @Get("/none-existent/name/:name")
  async isNotExistProductName(
    @Param("name") name: string,
  ): Promise<VerifyDataInterface> {
    await this.productVerifyService.isNotExistProductName(name);

    return {
      message:
        "해당 상품 이름이 데이터베이스에 존재하지 않는 것이 확인되었습니다.",
      setCookieKey: this.verfiy.is_not_exist.name_executed,
    };
  }
}
