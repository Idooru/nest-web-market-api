import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { CreateReviewDto } from "./../dto/create-review.dto";
import { IsLoginGuard } from "./../../../common/guards/is-login.guard";
import { ReviewService } from "../providers/review.service";
import { UpdateReviewDto } from "../dto/update-review.dto";
import { GetJWT } from "src/common/decorators/get.jwt.decorator";
import { JwtPayload } from "src/common/interfaces/jwt.payload.interface";
import { Cookies } from "src/common/decorators/cookies.decorator";

@Controller("review")
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}
  // @UseInterceptors()
  // @UseGuards(IsLoginGuard)
  // @Post("/product/:productName")
  // async createReview(
  //   @Body() createReviewDto: CreateReviewDto,
  //   @Param("productName") productName: string,
  //   @Cookies("reviewImageUrl") reviewImg: string[] | null,
  //   @Cookies("reviewVideoUrl") reviewVdo: string[] | null,
  //   @GetJWT() jwtPayload: JwtPayload,
  // ): Promise<JSON<void>> {
  //   const { userSelectScore } = createReviewDto;
  //   const starRating = await this.reviewService.putStarRating(
  //     userSelectScore,
  //     productName,
  //   );
  //   await this.reviewService.calculateRating(starRating);

  //   if (reviewImg || reviewVdo) {
  //     await this.reviewService.createReview({
  //       createReviewDto,
  //       jwtPayload,
  //       productName,
  //       reviewImg,
  //       reviewVdo,
  //     });
  //   } else {
  //     await this.reviewService.createReview({
  //       createReviewDto,
  //       jwtPayload,
  //       productName,
  //     });
  //   }

  //   return {
  //     statusCode: 201,
  //     message: "리뷰를 생성하였습니다.",
  //   };
  // }

  @Get("/test")
  test(@Cookies("Review_Image_Url_COOKIE") cookies: string[]) {
    console.log(cookies);
  }
}
