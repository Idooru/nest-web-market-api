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
import { GetDecodedJwt } from "src/common/decorators/get-decoded-jwt.decorator";
import { JwtPayload } from "src/common/interfaces/jwt-payload.interface";
import { Cookies } from "src/common/decorators/cookies.decorator";
import { JsonRes } from "src/common/interfaces/json-success.interface";

@Controller("review")
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(IsLoginGuard)
  @Post("/product/:productName")
  async createReview(
    @Body() createReviewDto: CreateReviewDto,
    @Param("productName") productName: string,
    @Cookies("reviewImageUrl") reviewImg: string[] | null,
    @Cookies("reviewVideoUrl") reviewVdo: string[] | null,
    @GetDecodedJwt() jwtPayload: JwtPayload,
  ): Promise<JsonRes<void>> {
    const { userSelectScore } = createReviewDto;
    const starRatingId = await this.reviewService.putStarRating(
      userSelectScore,
      productName,
    );
    this.reviewService.calculateRating(starRatingId);

    if (reviewImg || reviewVdo) {
      await this.reviewService.createReview({
        createReviewDto,
        jwtPayload,
        productName,
        reviewImg,
        reviewVdo,
      });
    } else {
      await this.reviewService.createReview({
        createReviewDto,
        jwtPayload,
        productName,
      });
    }

    return {
      statusCode: 201,
      message: "리뷰를 생성하였습니다.",
    };
  }

  @Get()
  findAll() {
    return this.reviewService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.reviewService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewService.update(+id, updateReviewDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.reviewService.remove(+id);
  }
}
