import { Injectable } from "@nestjs/common";
import { CreateReviewDto } from "src/model/review/dto/create-review.dto";
import { StarRatingService } from "src/model/review/providers/star-rating.service";

@Injectable()
export class Bundle {
  constructor(private readonly starRatingService: StarRatingService) {}

  async starRating(createReviewDto: CreateReviewDto, productName: string) {
    const { userSelectScore } = createReviewDto;
    const starRating = await this.starRatingService.putStarRating(
      userSelectScore,
      productName,
    );
    await this.starRatingService.calculateRating(starRating);
  }
}
