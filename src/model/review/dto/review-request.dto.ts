import { PickType } from "@nestjs/swagger";
import { ReceiveMediaDto } from "src/model/media/dto/receive-media.dto";
import { ReviewEntity } from "../entities/review.entity";

export class ReviewBody extends PickType(ReviewEntity, [
  "reviews",
  "scoreChosenByClient",
  "Image",
  "Video",
] as const) {}

export class PushReviewImageDto {
  reviewBody: ReviewBody;
  reviewImgCookies: ReceiveMediaDto[];
}

export class PushReviewVideoDto {
  reviewBody: ReviewBody;
  reviewVdoCookies: ReceiveMediaDto[];
}
