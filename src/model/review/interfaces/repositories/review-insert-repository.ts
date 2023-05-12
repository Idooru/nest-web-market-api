import { ClientUserEntity } from "src/model/user/entities/client-user.entity";
import { ReviewEntity } from "../../entities/review.entity";

export interface IReviewInsertRepository {
  findOneReviewById(id: string): Promise<ReviewEntity>;
  insertReviewIdOnClientUser(
    clientUser: ClientUserEntity,
    review: ReviewEntity,
  ): Promise<void>;
}
