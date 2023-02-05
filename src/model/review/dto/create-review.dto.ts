import { PickType } from "@nestjs/swagger";
import { ReviewEntity } from "../entities/review.entity";
import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { MediaUrlCookies } from "src/model/upload/media.url.cookies.interface";
import { ProductEntity } from "src/model/product/entities/product.entity";
import { UserEntity } from "src/model/user/entities/user.entity";

export class CreateReviewDto extends PickType(ReviewEntity, [
  "reviews",
  "userSelectScore",
  "Image",
  "Video",
] as const) {}

export class CreateReviewWithImageAndVideoDto {
  createReviewDto: CreateReviewDto;
  jwtPayload: JwtAccessTokenPayload;
  productId: string;
  reviewImgCookie: MediaUrlCookies[];
  reviewVdoCookie: MediaUrlCookies[];
}

export class CreateReviewWithImageDto {
  createReviewDto: CreateReviewDto;
  jwtPayload: JwtAccessTokenPayload;
  productId: string;
  reviewImgCookie: MediaUrlCookies[];
}

export class CreateReviewWithVideoDto {
  createReviewDto: CreateReviewDto;
  jwtPayload: JwtAccessTokenPayload;
  productId: string;
  reviewVdoCookie: MediaUrlCookies[];
}

export class CreateReviewWithoutMediaDto {
  createReviewDto: CreateReviewDto;
  jwtPayload: JwtAccessTokenPayload;
  productId: string;
}

export class CreateReviewDao {
  createReviewDto: CreateReviewDto;
  user: UserEntity;
  product: ProductEntity;
}
