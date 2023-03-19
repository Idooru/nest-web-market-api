import { PickType } from "@nestjs/swagger";
import { RequestMediaDto } from "src/model/media/dto/request-media.dto";
import { ReviewEntity } from "../entities/review.entity";

export class ReviewRequestDto extends PickType(ReviewEntity, [
  "reviews",
  "scoreChosenByClient",
  "Image",
  "Video",
] as const) {}

export class PushReviewImageDto {
  reviewBody: ReviewRequestDto;
  reviewImgCookies: RequestMediaDto[];
}

export class PushReviewVideoDto {
  reviewBody: ReviewRequestDto;
  reviewVdoCookies: RequestMediaDto[];
}
