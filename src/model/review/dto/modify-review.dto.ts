import {
  CreateReviewDto,
  CreateReviewWithImageAndVideoDao,
  CreateReviewWithImageDao,
  CreateReviewWithoutMediaDao,
  CreateReviewWithVideoDao,
} from "./create-review.dto";

export class ModifyReviewDto extends CreateReviewDto {}
export class ModifyReviewWithImageAndVideoDao extends CreateReviewWithImageAndVideoDao {}
export class ModifyReviewWithImageDao extends CreateReviewWithImageDao {}
export class ModifyReviewWithVideoDao extends CreateReviewWithVideoDao {}
export class ModifyReviewWithoutMediaDao extends CreateReviewWithoutMediaDao {}
