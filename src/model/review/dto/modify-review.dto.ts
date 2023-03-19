import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { ReviewEntity } from "../entities/review.entity";
import { ReviewRequestDto } from "./review-request.dto";

export class ModifyReviewDto {
  reviewRequestDto: ReviewRequestDto;
  jwtPayload: JwtAccessTokenPayload;
  beforeReview: ReviewEntity;
}
