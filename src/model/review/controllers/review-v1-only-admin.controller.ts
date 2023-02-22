import {
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { IsAdminGuard } from "src/common/guards/authenticate/is-admin.guard";
import { IsLoginGuard } from "src/common/guards/authenticate/is-login.guard";
import { JsonGeneralInterface } from "src/common/interceptors/general/interface/json-general-interface";
import { JsonGeneralInterceptor } from "src/common/interceptors/general/json-general.interceptor";
import { ProductGeneralService } from "src/model/product/services/product-general.service";
import { ReviewEntity } from "../entities/review.entity";

@UseGuards(IsAdminGuard)
@UseGuards(IsLoginGuard)
@Controller("/api/v1/only-admin/review")
export class ReviewVersionOneOnlyAdminController {
  constructor(private readonly productService: ProductGeneralService) {}

  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/product/:productId")
  async findReviewFromProduct(
    @Param("productId") id: string,
  ): Promise<JsonGeneralInterface<ReviewEntity[]>> {
    return {
      statusCode: 200,
      message: `상품아이디(${id})에 해당하는 상품의 리뷰를 가져옵니다.`,
      result: (await this.productService.findProductById(id)).Review,
    };
  }
}
