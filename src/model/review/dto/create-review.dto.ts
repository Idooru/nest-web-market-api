import { PickType } from "@nestjs/swagger";
import { ReviewEntity } from "../entities/review.entity";
import { JwtPayload } from "src/common/interfaces/jwt.payload.interface";
import { MediaUrlCookie } from "src/common/interfaces/media.url.cookie.interface";

export class CreateReviewDto extends PickType(ReviewEntity, [
  "reviews",
  "userSelectScore",
  "Image",
  "Video",
] as const) {}

export class CreateReviewWithImageAndVideoDto {
  createReviewDto: CreateReviewDto;
  jwtPayload: JwtPayload;
  productId: string;
  reviewImgCookie: MediaUrlCookie[];
  reviewVdoCookie: MediaUrlCookie[];
}

export class CreateReviewWithImageDto {
  createReviewDto: CreateReviewDto;
  jwtPayload: JwtPayload;
  productId: string;
  reviewImgCookie: MediaUrlCookie[];
}

export class CreateReviewWithVideoDto {
  createReviewDto: CreateReviewDto;
  jwtPayload: JwtPayload;
  productId: string;
  reviewVdoCookie: MediaUrlCookie[];
}

export class CreateReviewWithoutMediaDto {
  createReviewDto: CreateReviewDto;
  jwtPayload: JwtPayload;
  productId: string;
}
