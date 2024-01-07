import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { ProductEntity } from "../../product/entities/product.entity";
import { ClientUserEntity } from "../../user/entities/client-user.entity";
import { ProductSearcher } from "../../product/logic/product.searcher";
import { UserSearcher } from "../../user/logic/user.searcher";
import { ReviewEntity } from "../entities/review.entity";
import { ReviewSearcher } from "./review.searcher";
import { StarRateEntity } from "../entities/star-rate.entity";
import { loggerFactory } from "../../../common/functions/logger.factory";

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
    const clientUser = await this.userSearcher.findClientUserObjectWithId(
      userId,
    );
    const reviews = await this.reviewSearcher.findAllClientsReviews(
      clientUser.id,
    );
    const review = reviews.find((review) => review.id === reviewId);

    if (!review) {
      // 만약 리뷰를 하나도 작성하지 않은 사용자가 다른 사용자의 리뷰를 수정하려고 시도할시 아래 예외가 발생한다.
      const message = `다른 사용자(${clientUser.id})가 임의로 리뷰 수정을 시도합니다.`;
      loggerFactory("Another Writer").warn(message);
      throw new ForbiddenException(message);
    }

    return review;
  }

  private checkModifyCount(review: ReviewEntity): void {
    if (review.countForModify === 0) {
      throw new ForbiddenException("해당 리뷰는 더이상 수정할 수 없습니다.");
    }
  }

  public getProductAndClient(
    productId: string,
    userId: string,
  ): Promise<[ProductEntity, ClientUserEntity]> {
    return Promise.all([
      this.productSearcher.findProductWithId(productId),
      this.userSearcher.findClientUserObjectWithId(userId),
    ]);
  }

  public checkBeforeCreate(
    product: ProductEntity,
    clientUser: ClientUserEntity,
  ) {
    const alreadyWriten = product.Review.find(
      (review) => review.reviewer.id === clientUser.id,
    );

    if (alreadyWriten) {
      const message = `해당 사용자(${clientUser.id})는 해당 상품(${product.id})에 대한 리뷰를 이미 남겼습니다.`;
      loggerFactory("Already Writen").warn(message);
      throw new BadRequestException(message);
    }
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
