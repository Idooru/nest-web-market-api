import { IntersectionType, PickType } from "@nestjs/swagger";
import { ReviewEntity } from "../entities/review.entity";
import { JwtPayload } from "src/common/interfaces/jwt-payload.interface";
import { IsEnum, IsNotEmpty, IsNumber } from "class-validator";

export class Comments extends PickType(ReviewEntity, ["comments"] as const) {}

export class Rating {
  @IsEnum([1, 2, 3, 4, 5])
  @IsNotEmpty()
  userSelectScore: 1 | 2 | 3 | 4 | 5;
}

export class CreateReviewDto extends IntersectionType(Comments, Rating) {}

export class CreateReviewServiceDto {
  createReviewDto: CreateReviewDto;
  jwtPayload: JwtPayload;
  productName: string;
  reviewImg?: string[];
  reviewVdo?: string[];
}
