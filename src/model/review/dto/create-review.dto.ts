import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { ProductEntity } from "src/model/product/entities/product.entity";
import { ClientUserEntity } from "src/model/user/entities/client-user.entity";
import { ReviewBody } from "./review-body";

export class CreateReviewDto {
  reviewBody: ReviewBody;
  jwtPayload: JwtAccessTokenPayload;
  productId: string;
}

export class CreateReviewDao {
  reviewBody: ReviewBody;
  client: ClientUserEntity;
  product: ProductEntity;
}
