import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { ProductEntity } from "src/model/product/entities/product.entity";
import { ClientUserEntity } from "src/model/user/entities/client-user.entity";
import { ReviewDto } from "./review-request.dto";

export class CreateReviewDto {
  reviewRequestDto: ReviewDto;
  jwtPayload: JwtAccessTokenPayload;
  productId: string;
}

export class CreateReviewDao {
  reviewRequestDto: ReviewDto;
  client: ClientUserEntity;
  product: ProductEntity;
}
