import { IntersectionType, PickType } from "@nestjs/swagger";
import { ProductEntity } from "src/model/product/product.entity";
import { ReviewEntity } from "../entities/review.entity";

export class Comments extends PickType(ReviewEntity, ["comments"] as const) {}
export class Rating extends PickType(ProductEntity, ["rating"] as const) {}
export class CreateReviewDto extends IntersectionType(Comments, Rating) {}
