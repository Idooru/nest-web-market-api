import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { ReviewEntity } from "../entities/review.entity";
import { ReviewBody } from "./review-body";

export class ModifyReviewDto {
  reviewBody: ReviewBody;
  jwtPayload: JwtAccessTokenPayload;
  beforeReview: ReviewEntity;
}
