import { Inject, Injectable } from "@nestjs/common";
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
import { ProductEntity } from "../../../product/entities/product.entity";
import { ReviewImageSearcher } from "../../../media/logic/review-image.searcher";
import { ReviewImageEntity } from "../../../media/entities/review-image.entity";
import { ReviewVideoSearcher } from "../../../media/logic/review-video.searcher";
import { ReviewVideoEntity } from "../../../media/entities/review-video.entity";
import { MediaCookieDto } from "../../../media/dto/request/media-cookie.dto";
import { BaseEntity } from "typeorm";

class EntityFinder {
  constructor(
    private readonly productIdFilter: string,
    private readonly productSearcher: ProductSearcher,
    private readonly reviewImageSearcher: ReviewImageSearcher,
    private readonly reviewVideoSearcher: ReviewVideoSearcher,
  ) {}

  public findProduct(productId: string, entities: (typeof BaseEntity)[]) {
    return this.productSearcher.findEntity({
      property: this.productIdFilter,
      alias: { id: productId },
      getOne: true,
      entities,
    }) as Promise<ProductEntity>;
  }

  public findReviewImages(reviewImgCookies: MediaCookieDto[]): Promise<ReviewImageEntity[]> {
    return Promise.all(
      reviewImgCookies.map(
        (imgCookie) =>
          this.reviewImageSearcher.findEntity({
            property: "reviewImage.id = :id",
            alias: { id: imgCookie.id },
            getOne: true,
          }) as Promise<ReviewImageEntity>,
      ),
    );
  }

  public findReviewVideos(reviewVdoCookies: MediaCookieDto[]): Promise<ReviewVideoEntity[]> {
    return Promise.all(
      reviewVdoCookies.map(
        (vdoCookie) =>
          this.reviewVideoSearcher.findEntity({
            property: "reviewVideo.id = :id",
            alias: { id: vdoCookie.id },
            getOne: true,
          }) as Promise<ReviewVideoEntity>,
      ),
    );
  }

  public findBeforeReviewImages(reviewId: string): Promise<ReviewImageEntity[]> {
    return this.reviewImageSearcher.findEntity({
      property: "reviewImage.reviewId = :reviewId",
      alias: { reviewId },
      getOne: false,
    }) as Promise<ReviewImageEntity[]>;
  }

  public findBeforeReviewVideos(reviewId: string): Promise<ReviewVideoEntity[]> {
    return this.reviewVideoSearcher.findEntity({
      property: "reviewVideo.reviewId = :reviewId",
      alias: { reviewId },
      getOne: false,
    }) as Promise<ReviewVideoEntity[]>;
  }
}

@Injectable()
export class ReviewTransactionSearcher {
  private readonly entityFinder: EntityFinder;

  constructor(
    @Inject("product-id-filter")
    private readonly productIdFilter: string,
    private readonly productSearcher: ProductSearcher,
    private readonly reviewImageSearcher: ReviewImageSearcher,
    private readonly reviewVideoSearcher: ReviewVideoSearcher,
    private readonly reviewUtils: ReviewUtils,
  ) {
    this.entityFinder = new EntityFinder(
      this.productIdFilter,
      this.productSearcher,
      this.reviewImageSearcher,
      this.reviewVideoSearcher,
    );
  }

  public async searchCreateReview(dto: CreateReviewDto): Promise<SearchCreateReviewDto> {
    const { body, reviewerId, productId, reviewImgCookies, reviewVdoCookies } = dto;
    const product = await this.entityFinder.findProduct(productId, [ReviewEntity, StarRateEntity]);

    await this.reviewUtils.checkBeforeCreate(product, reviewerId);

    const [reviewImages, reviewVideos] = await Promise.all([
      this.entityFinder.findReviewImages(reviewImgCookies),
      this.entityFinder.findReviewVideos(reviewVdoCookies),
    ]);

    return {
      body,
      productId,
      reviewerId,
      reviewImages,
      reviewVideos,
      starRate: product.StarRate,
    };
  }

  public async searchModifyReview(dto: ModifyReviewDto): Promise<SearchModifyReviewDto> {
    const { body, userId, productId, reviewId, reviewImgCookies, reviewVdoCookies } = dto;
    const [review, product] = await Promise.all([
      this.reviewUtils.checkBeforeModify(reviewId, userId),
      this.entityFinder.findProduct(productId, [StarRateEntity]),
    ]);

    const [beforeReviewImages, newReviewImages, beforeReviewVideos, newReviewVideos] = await Promise.all([
      this.entityFinder.findBeforeReviewImages(review.id),
      this.entityFinder.findReviewImages(reviewImgCookies),
      this.entityFinder.findBeforeReviewVideos(review.id),
      this.entityFinder.findReviewVideos(reviewVdoCookies),
    ]);

    return {
      body,
      review,
      beforeReviewImages,
      newReviewImages,
      beforeReviewVideos,
      newReviewVideos,
      starRate: product.StarRate,
    };
  }

  public async searchDeleteReview(dto: DeleteReviewDto): Promise<SearchDeleteReviewDto> {
    const { reviewId, userId } = dto;

    const review = await this.reviewUtils.checkBeforeModify(reviewId, userId);
    const product = await this.entityFinder.findProduct(review.Product.id, [StarRateEntity]);

    return { review, starRate: product.StarRate };
  }
}
