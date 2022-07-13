import { IntersectionType, PickType } from "@nestjs/swagger";
import { ReviewEntity } from "../entities/review.entity";
import { JwtPayload } from "src/common/interfaces/jwt.payload.interface";
import { MediaUrlCookie } from "src/common/interfaces/media.url.cookie.interface";
import { IsEnum, IsNotEmpty } from "class-validator";

export class Comments extends PickType(ReviewEntity, ["comments"] as const) {}

export class Rating {
  @IsEnum([1, 2, 3, 4, 5])
  @IsNotEmpty()
  userSelectScore: 1 | 2 | 3 | 4 | 5;
}

export class CreateReviewDto extends IntersectionType(Comments, Rating) {}

export class CreateReviewWithImageAndVideoDao {
  createReviewDto: CreateReviewDto;
  jwtPayload: JwtPayload;
  productName: string;
  reviewImgCookie: MediaUrlCookie[];
  reviewVdoCookie: MediaUrlCookie[];
}

export class CreateReviewWithImage {
  createReviewDto: CreateReviewDto;
  jwtPayload: JwtPayload;
  productName: string;
  reviewImgCookie: MediaUrlCookie[];
}

export class CreateReviewWithVideo {
  createReviewDto: CreateReviewDto;
  jwtPayload: JwtPayload;
  productName: string;
  reviewVdoCookie: MediaUrlCookie[];
}

export class CreateReviewWithoutMediaDao {
  createReviewDto: CreateReviewDto;
  jwtPayload: JwtPayload;
  productName: string;
}