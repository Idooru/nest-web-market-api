import { PickType } from "@nestjs/swagger";
import { ReviewEntity } from "../entities/review.entity";

export class ReviewRequestDto extends PickType(ReviewEntity, [
  "reviews",
  "scoreChosenByClient",
  "Image",
  "Video",
] as const) {}
