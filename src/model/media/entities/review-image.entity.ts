import { Entity, JoinColumn, ManyToOne } from "typeorm";
import { ReviewEntity } from "src/model/review/entities/review.entity";
import { MediaEntity } from "../../../common/entities/media.entity";

@Entity({ name: "reviews_images", synchronize: true })
export class ReviewImageEntity extends MediaEntity {
  @ManyToOne(() => ReviewEntity, (review) => review.ReviewImage, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ referencedColumnName: "id", name: "reviewId" })
  public Review: ReviewEntity;
}
