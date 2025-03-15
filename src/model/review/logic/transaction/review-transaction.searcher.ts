import { Injectable } from "@nestjs/common";
import { ReviewSearcher } from "../review.searcher";
import { MediaSearcher } from "../../../media/logic/media.searcher";
import { ProductSearcher } from "../../../product/logic/product.searcher";
import { ReviewUtils } from "../review.utils";
import { CreateReviewDto } from "../../dto/create-review.dto";
import { SearchCreateReviewDto } from "../../dto/search-create-review.dto";
import { ModifyReviewDto } from "../../dto/modify-review.dto";
import { SearchModifyReviewDto } from "../../dto/search-modify-review.dto";
import { DeleteReviewDto } from "../../dto/delete-review.dto";
import { SearchDeleteReviewDto } from "../../../product/dto/search-delete-review.dto";

@Injectable()
export class ReviewTransactionSearcher {
  constructor(
    private readonly reviewSearcher: ReviewSearcher,
    private readonly mediaSearcher: MediaSearcher,
    private readonly productSearcher: ProductSearcher,
    private readonly reviewUtils: ReviewUtils,
  ) {}

  public async searchCreateReview(dto: CreateReviewDto): Promise<SearchCreateReviewDto> {
    const { body, reviewerId, productId, reviewImgCookies, reviewVdoCookies } = dto;
    const product = await this.productSearcher.findProductWithId(productId);

    this.reviewUtils.checkBeforeCreate(product, reviewerId);

    const [reviewImages, reviewVideos, starRate] = await Promise.all([
      this.mediaSearcher.findReviewImagesWithId(reviewImgCookies),
      this.mediaSearcher.findReviewVideosWithId(reviewVdoCookies),
      this.reviewSearcher.findStarRateWithId(product.StarRate.id),
    ]);

    return {
      body,
      productId,
      reviewerId,
      reviewImages,
      reviewVideos,
      starRate,
    };
  }

  public async searchModifyReview(dto: ModifyReviewDto): Promise<SearchModifyReviewDto> {
    const { body, userId, productId, reviewId, reviewImgCookies, reviewVdoCookies } = dto;
    const review = await this.reviewUtils.checkBeforeModify(reviewId, userId);
    const product = await this.productSearcher.findProductWithId(productId);

    const [beforeReviewImages, newReviewImages, beforeReviewVideos, newReviewVideos, starRate] = await Promise.all([
      this.mediaSearcher.findBeforeReviewImagesWithId(review.id),
      this.mediaSearcher.findReviewImagesWithId(reviewImgCookies),
      this.mediaSearcher.findBeforeReviewVideosWithId(review.id),
      this.mediaSearcher.findReviewVideosWithId(reviewVdoCookies),
      this.reviewSearcher.findStarRateWithId(product.StarRate.id),
    ]);

    return {
      body,
      review,
      beforeReviewImages,
      newReviewImages,
      beforeReviewVideos,
      newReviewVideos,
      starRate,
    };
  }

  public async searchDeleteReview(dto: DeleteReviewDto): Promise<SearchDeleteReviewDto> {
    const { reviewId, userId } = dto;

    const review = await this.reviewUtils.checkBeforeModify(reviewId, userId);
    const product = await this.productSearcher.findProductWithId(review.Product.id);
    const starRate = await this.reviewSearcher.findStarRateWithId(product.StarRate.id);

    return { review, starRate };
  }
}
