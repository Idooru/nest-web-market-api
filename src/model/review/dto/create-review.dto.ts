import { IntersectionType, PickType } from "@nestjs/swagger";
import { ReviewEntity } from "../entities/review.entity";
import { JwtPayload } from "src/common/interfaces/jwt-payload.interface";

export class Comments extends PickType(ReviewEntity, ["comments"] as const) {}

export class Rating {
  userSelectPoint: number;
}

export class CreateReviewDto extends IntersectionType(Comments, Rating) {}

export class CreateReviewServiceDto {
  createReviewDto: CreateReviewDto;
  jwtPayload: JwtPayload;
  productName: string;
  reviewImg?: string[];
  reviewVdo?: string[];
}
