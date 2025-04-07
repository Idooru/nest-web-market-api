import { BadRequestException, ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { ProductEntity } from "../../product/entities/product.entity";
import { ReviewEntity } from "../entities/review.entity";
import { ReviewSearcher } from "./review.searcher";
import { StarRateEntity } from "../entities/star-rate.entity";
import { loggerFactory } from "../../../common/functions/logger.factory";
import { ClientUserEntity } from "../../user/entities/client-user.entity";

class EntityFinder {
  constructor(private readonly reviewIdFilter: string, private readonly reviewSearcher: ReviewSearcher) {}

  public findReview(reviewId: string): Promise<ReviewEntity> {
    return this.reviewSearcher.findEntity({
      property: this.reviewIdFilter,
      alias: { id: reviewId },
      getOne: true,
      entities: [ClientUserEntity],
    }) as Promise<ReviewEntity>;
  }

  public findReviews(userId: string): Promise<ReviewEntity[]> {
    return this.reviewSearcher.findEntity({
      property: "ClientUser.id = :id",
      alias: { id: userId },
      getOne: false,
      entities: [ClientUserEntity, ProductEntity],
    }) as Promise<ReviewEntity[]>;
  }
}

@Injectable()
export class ReviewUtils {
  private readonly entityFinder: EntityFinder;

  constructor(
    @Inject("review-id-filter")
    private readonly reviewIdFilter: string,
    private readonly reviewSearcher: ReviewSearcher,
  ) {
    this.entityFinder = new EntityFinder(this.reviewIdFilter, this.reviewSearcher);
  }

  public async checkBeforeCreate(product: ProductEntity, userId: string): Promise<void> {
    if (!product.Review.length) return;

    const alreadyWritten = product.Review.find(async (review) => {
      const found = await this.entityFinder.findReview(review.id);
      return found.ClientUser.id == userId;
    });

    if (alreadyWritten) {
      const message = `해당 사용자(${userId})는 해당 상품(${product.id})에 대한 리뷰를 이미 남겼습니다.`;
      loggerFactory("Already Writen").warn(message);
      throw new BadRequestException(message);
    }
  }

  public async checkBeforeModify(reviewId: string, userId: string): Promise<ReviewEntity> {
    const reviews = await this.entityFinder.findReviews(userId);
    const review = reviews.find((review) => review.id === reviewId);

    if (!review) {
      // 만약 리뷰를 하나도 작성하지 않은 사용자가 다른 사용자의 리뷰를 수정하려고 시도할시 아래 예외가 발생한다.
      const message = `다른 사용자(${userId})가 임의로 리뷰 수정을 시도합니다.`;
      loggerFactory("Another Writer").warn(message);
      throw new ForbiddenException(message);
    }

    if (review.countForModify === 0) {
      throw new ForbiddenException("해당 리뷰는 더이상 수정할 수 없습니다.");
    }

    return review;
  }

  public async calculateStarRate(starRate: StarRateEntity): Promise<StarRateEntity> {
    const starRateProperty = Object.entries(starRate);

    const sum: number = starRateProperty
      .filter((prop) => prop[0].includes("PointSum"))
      .map((arr) => arr[1])
      .reduce((acc, cur) => acc + cur, 0);

    const count: number = starRateProperty
      .filter((prop) => prop[0].includes("PointCount"))
      .map((arr) => arr[1])
      .reduce((acc, cur) => acc + cur, 0);

    const number = Number((sum / count).toFixed(2));
    starRate.averageScore = isNaN(number) ? 0 : number;

    return starRate;
  }
}
