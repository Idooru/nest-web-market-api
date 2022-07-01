import { IsLoginGuard } from "./../../../common/guards/is-login.guard";
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
import { ReviewService } from "../review.service";
import { CreateReviewDto } from "../dto/create-review.dto";
import { UpdateReviewDto } from "../dto/update-review.dto";
import { GetDecodedJwt } from "src/common/decorators/get-decoded-jwt.decorator";
import { JwtPayload } from "src/common/interfaces/jwt-payload.interface";
import { Cookies } from "src/common/decorators/cookies.decorator";

@Controller("review")
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(IsLoginGuard)
  @Post("/")
  async createReview(
    @Body() createReviewDto: CreateReviewDto,
    @Cookies("reviewImageUrl") reviewImg: string[] | null,
    @Cookies("reviewVideoUrl") reviewVdo: string[] | null,
    @GetDecodedJwt() jwtPayload: JwtPayload,
  ) {
    reviewImg.length && reviewVdo.length
      ? await this.reviewService.createReview(
          createReviewDto,
          jwtPayload,
          reviewImg,
          reviewVdo,
        )
      : await this.reviewService.createReview(createReviewDto, jwtPayload);
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
