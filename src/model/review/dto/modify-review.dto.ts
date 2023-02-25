import { CreateReviewDto } from "./create-review.dto";
import { ReceiveMediaDto } from "src/model/media/dto/receive-media.dto";
import { ReviewEntity } from "../entities/review.entity";

export class ModifyReviewDto extends CreateReviewDto {}

export class ModifyReviewWithImageAndVideoDto {
  modifyReviewDto: ModifyReviewDto;
  review: ReviewEntity;
  reviewImgCookies: ReceiveMediaDto[];
  reviewVdoCookies: ReceiveMediaDto[];
}

export class ModifyReviewWithImageDto {
  modifyReviewDto: ModifyReviewDto;
  review: ReviewEntity;
  reviewImgCookies: ReceiveMediaDto[];
}

export class ModifyReviewWithVideoDto {
  modifyReviewDto: ModifyReviewDto;
  review: ReviewEntity;
  reviewVdoCookies: ReceiveMediaDto[];
}

export class ModifyReviewDao {
  modifyReviewDto: ModifyReviewDto;
  review: ReviewEntity;
}
