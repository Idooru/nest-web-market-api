import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { ReviewEntity } from "../entities/review.entity";
import { ReviewDto } from "./review.dto";

export class ModifyReviewDto {
  reviewRequestDto: ReviewDto;
  jwtPayload: JwtAccessTokenPayload;
  beforeReview: ReviewEntity;
}
