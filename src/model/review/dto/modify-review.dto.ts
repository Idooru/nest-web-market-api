import {
  CreateReviewDto,
  CreateReviewWithImageAndVideoDto,
  CreateReviewWithImageDto,
  CreateReviewWithoutMediaDto,
  CreateReviewWithVideoDto,
} from "./create-review.dto";

export class ModifyReviewDto extends CreateReviewDto {}
export class ModifyReviewWithImageAndVideoDao extends CreateReviewWithImageAndVideoDto {}
export class ModifyReviewWithImageDao extends CreateReviewWithImageDto {}
export class ModifyReviewWithVideoDao extends CreateReviewWithVideoDto {}
export class ModifyReviewWithoutMediaDao extends CreateReviewWithoutMediaDto {}
