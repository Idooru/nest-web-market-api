import {
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { IsAdminGuard } from "src/common/guards/authenticate/is-admin.guard";
import { IsLoginGuard } from "src/common/guards/authenticate/is-login.guard";
import { JsonGeneralInterface } from "src/common/interceptors/interface/json-general-interface";
import { JsonGeneralInterceptor } from "src/common/interceptors/general/json-general.interceptor";
import { ReviewEntity } from "../entities/review.entity";
import { ReviewGeneralService } from "../services/review-general.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("v1 관리자 Review API")
@UseGuards(IsAdminGuard)
@UseGuards(IsLoginGuard)
@Controller("/api/v1/only-admin/review")
export class ReviewVersionOneOnlyAdminController {
  constructor(private readonly reviewGeneralService: ReviewGeneralService) {}

  @ApiOperation({
    summary: "find review from product id",
    description:
      "상품의 아이디에 해당하는 상품의 리뷰를 가져옵니다. 상품의 아이디와 일치하는 row가 데이터베이스에 존재하지 않을 경우 에러를 반환합니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/product/:productId")
  async findReviewFromProductById(
    @Param("productId") id: string,
  ): Promise<JsonGeneralInterface<ReviewEntity[]>> {
    return {
      statusCode: 200,
      message: `상품아이디(${id})에 해당하는 상품의 리뷰를 가져옵니다.`,
      result: await this.reviewGeneralService.findReviewFromProductById(id),
    };
  }
}
