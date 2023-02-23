import { CreateReviewDto } from "./create-review.dto";
import { ReviewEntity } from "../entities/review.entity";
import { MediaReceiveDto } from "src/model/upload/dto/media-receive.dto";

export class ModifyReviewDto extends CreateReviewDto {}

export class ModifyReviewWithImageAndVideoDto {
  modifyReviewDto: ModifyReviewDto;
  review: ReviewEntity;
  reviewImgCookies: MediaReceiveDto[];
  reviewVdoCookies: MediaReceiveDto[];
}

export class ModifyReviewWithImageDto {
  modifyReviewDto: ModifyReviewDto;
  review: ReviewEntity;
  reviewImgCookies: MediaReceiveDto[];
}

export class ModifyReviewWithVideoDto {
  modifyReviewDto: ModifyReviewDto;
  review: ReviewEntity;
  reviewVdoCookies: MediaReceiveDto[];
}

export class ModifyReviewDao {
  modifyReviewDto: ModifyReviewDto;
  review: ReviewEntity;
}
