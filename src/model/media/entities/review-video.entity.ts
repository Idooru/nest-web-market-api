import { Entity, JoinColumn, ManyToOne } from "typeorm";
import { ReviewEntity } from "src/model/review/entities/review.entity";
import { MediaEntity } from "../../../common/entities/media.entity";

@Entity({ name: "reviews_videos", synchronize: true })
export class ReviewVideoEntity extends MediaEntity {
  @ManyToOne(() => ReviewEntity, (review) => review.ReviewVideo, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ referencedColumnName: "id", name: "reviewId" })
  public Review: ReviewEntity;
}
