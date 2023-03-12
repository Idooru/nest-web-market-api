import { Controller, Get, Param, UseInterceptors } from "@nestjs/common";
import { verifyCookieKeys } from "src/common/config/cookie-key-configs";
import { SendVerifyCookieInterceptor } from "src/common/interceptors/verify/send-verify-cookie.interceptor";
import { VerifyDataDto } from "src/common/interceptors/verify/verify-data.dto";
import { ProductVerifyService } from "../../services/product-verify.service";

@Controller("/api/v1/verify/product")
export class ProductVersionOneVerfiyController {
  constructor(private readonly productVerifyService: ProductVerifyService) {}

  private readonly productVerifyCookieKey = verifyCookieKeys.product;

  @UseInterceptors(SendVerifyCookieInterceptor)
  @Get("/existent/id/:id")
  async isExistProductId(@Param("id") id: string): Promise<VerifyDataDto> {
    await this.productVerifyService.isExistProductId(id);

    return {
      message:
        "해당 상품 아이디가 데이터베이스에 존재하는 것이 확인되었습니다.",
      setCookieKey: this.productVerifyCookieKey.is_exist.id_executed,
    };
  }

  @UseInterceptors(SendVerifyCookieInterceptor)
  @Get("/none-existent/name/:name")
  async isNotExistProductName(
    @Param("name") name: string,
  ): Promise<VerifyDataDto> {
    await this.productVerifyService.isNotExistProductName(name);

    return {
      message:
        "해당 상품 이름이 데이터베이스에 존재하지 않는 것이 확인되었습니다.",
      setCookieKey: this.productVerifyCookieKey.is_not_exist.name_executed,
    };
  }
}
