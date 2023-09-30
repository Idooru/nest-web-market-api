import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ProductEntity } from "../../product/entities/product.entity";
import { ClientUserEntity } from "../../user/entities/client-user.entity";
import { ProductSearcher } from "../../product/logic/product.searcher";
import { UserSearcher } from "../../user/logic/user.searcher";
import { ReviewEntity } from "../entities/review.entity";
import { ReviewSearcher } from "./review.searcher";
import { StarRateEntity } from "../entities/star-rate.entity";

@Injectable()
export class ReviewUtils {
  constructor(
    private readonly productSearcher: ProductSearcher,
    private readonly userSearcher: UserSearcher,
    private readonly reviewSearcher: ReviewSearcher,
  ) {}

  private async distinguishOwnReview(
    reviewId: string,
    userId: string,
  ): Promise<ReviewEntity> {
    const client = await this.userSearcher.findClientUserObjectWithId(userId);
    const reviews = await this.reviewSearcher.findAllClientsReviews(client.id);

    if (!reviews.length) {
      throw new NotFoundException(
        `고객 사용자의 아이디(${userId})로 작성된 리뷰가 없습니다.`,
      );
    }

    const review = reviews.find((review) => review.id === reviewId);

    if (!review) {
      // 만약 리뷰를 하나도 작성하지 않은 사용자가 다른 사용자의 리뷰를 수정하려고 시도할시 아래 예외가 발생한다.
      throw new ForbiddenException(
        `고객 사용자의 아이디(${client.id})로 작성된 리뷰중에 reviewId(${reviewId})와 같은 리뷰를 찾을 수 없습니다.`,
      );
    }

    return review;
  }

  private checkModifyCount(review: ReviewEntity): void {
    if (review.countForModify === 0) {
      throw new ForbiddenException("해당 리뷰는 더이상 수정할 수 없습니다.");
    }
  }

  public async getProductAndClient(
    productId: string,
    userId: string,
  ): Promise<[ProductEntity, ClientUserEntity]> {
    return await Promise.all([
      this.productSearcher.findProductWithId(productId),
      this.userSearcher.findClientUserObjectWithId(userId),
    ]);
  }

  public async checkBeforeModify(
    reviewId: string,
    userId: string,
  ): Promise<ReviewEntity> {
    const review = await this.distinguishOwnReview(reviewId, userId);
    this.checkModifyCount(review);

    return review;
  }

  public async calculateStarRate(
    starRate: StarRateEntity,
  ): Promise<StarRateEntity> {
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
