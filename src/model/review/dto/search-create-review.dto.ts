import { ReviewBody } from "./review-body.dto";
import { ProductEntity } from "../../product/entities/product.entity";
import { ClientUserEntity } from "../../user/entities/client-user.entity";
import { ReviewImageEntity } from "../../media/entities/review-image.entity";
import { ReviewVideoEntity } from "../../media/entities/review-video.entity";
import { StarRateEntity } from "../entities/star-rate.entity";

export class SearchCreateReviewDto {
  body: ReviewBody;
  productId: string;
  reviewerId: string;
  reviewImages: ReviewImageEntity[];
  reviewVideos: ReviewVideoEntity[];
  starRate: StarRateEntity;
}
