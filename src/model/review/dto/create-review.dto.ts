import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { ProductEntity } from "src/model/product/entities/product.entity";
import { ClientUserEntity } from "src/model/user/entities/client-user.entity";
import { ReviewBodyDto } from "./review.dto";

export class CreateReviewDto {
  reviewRequestDto: ReviewBodyDto;
  jwtPayload: JwtAccessTokenPayload;
  productId: string;
}

export class CreateReviewDao {
  reviewRequestDto: ReviewBodyDto;
  client: ClientUserEntity;
  product: ProductEntity;
}
