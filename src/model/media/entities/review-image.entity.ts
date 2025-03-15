import { Entity, JoinColumn, ManyToOne } from "typeorm";
import { ReviewEntity } from "src/model/review/entities/review.entity";
import { MediaEntity } from "../../../common/entities/media.entity";
import { ClientUserEntity } from "src/model/user/entities/client-user.entity";

@Entity({ name: "reviews_images", synchronize: true })
export class ReviewImageEntity extends MediaEntity {
  @ManyToOne(() => ReviewEntity, (review) => review.Image, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ referencedColumnName: "id", name: "reviewId" })
  public Review: ReviewEntity;

  @ManyToOne(() => ClientUserEntity, (client) => client.uploadedReviewImage, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ referencedColumnName: "id", name: "uploaderId" })
  public uploader: ClientUserEntity;
}
