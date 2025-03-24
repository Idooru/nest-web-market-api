import { Injectable } from "@nestjs/common";
import { ReviewSearcher } from "../review.searcher";
import { MediaSearcher } from "../../../media/logic/media.searcher";
import { ProductSearcher } from "../../../product/logic/product.searcher";
import { ReviewUtils } from "../review.utils";
import { ReviewEntity } from "../../entities/review.entity";
import { StarRateEntity } from "../../entities/star-rate.entity";
import { CreateReviewDto } from "../../dto/request/create-review.dto";
import { SearchCreateReviewDto } from "../../dto/request/search-create-review.dto";
import { ModifyReviewDto } from "../../dto/request/modify-review.dto";
import { SearchModifyReviewDto } from "../../dto/request/search-modify-review.dto";
import { DeleteReviewDto } from "../../dto/request/delete-review.dto";
import { SearchDeleteReviewDto } from "../../dto/request/search-delete-review.dto";

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
    const product = await this.productSearcher.findEntity(productId, [ReviewEntity, StarRateEntity]);

    await this.reviewUtils.checkBeforeCreate(product, reviewerId);

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
    const product = await this.productSearcher.findEntity(productId, [StarRateEntity]);

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
    const product = await this.productSearcher.findEntity(review.Product.id, [StarRateEntity]);
    const starRate = await this.reviewSearcher.findStarRateWithId(product.StarRate.id);

    return { review, starRate };
  }
}
