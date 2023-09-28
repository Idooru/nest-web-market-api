import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { ReviewEntity } from "../entities/review.entity";
import { ReviewBodyDto } from "./review.dto";

export class ModifyReviewDto {
  reviewRequestDto: ReviewBodyDto;
  jwtPayload: JwtAccessTokenPayload;
  beforeReview: ReviewEntity;
}
