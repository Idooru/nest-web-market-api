import { PickType } from "@nestjs/swagger";
import { ReviewEntity } from "../entities/review.entity";
import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { ProductEntity } from "src/model/product/entities/product.entity";
import { ReceiveMediaDto } from "src/model/media/dto/receive-media.dto";
import { ClientUserEntity } from "src/model/user/entities/client-user.entity";

export class CreateReviewDto extends PickType(ReviewEntity, [
  "reviews",
  "scoreChosenByClient",
  "Image",
  "Video",
] as const) {}

export class CreateReviewWithImageAndVideoDto {
  createReviewDto: CreateReviewDto;
  jwtPayload: JwtAccessTokenPayload;
  productId: string;
  reviewImgCookies: ReceiveMediaDto[];
  reviewVdoCookies: ReceiveMediaDto[];
}

export class CreateReviewWithImageDto {
  createReviewDto: CreateReviewDto;
  jwtPayload: JwtAccessTokenPayload;
  productId: string;
  reviewImgCookies: ReceiveMediaDto[];
}

export class CreateReviewWithVideoDto {
  createReviewDto: CreateReviewDto;
  jwtPayload: JwtAccessTokenPayload;
  productId: string;
  reviewVdoCookies: ReceiveMediaDto[];
}

export class CreateReviewWithoutMediaDto {
  createReviewDto: CreateReviewDto;
  jwtPayload: JwtAccessTokenPayload;
  productId: string;
}

export class CreateReviewDao {
  createReviewDto: CreateReviewDto;
  clientUser: ClientUserEntity;
  product: ProductEntity;
}
