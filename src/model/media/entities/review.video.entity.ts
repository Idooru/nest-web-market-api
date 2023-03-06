import { Entity, ManyToOne } from "typeorm";
import { ReviewEntity } from "src/model/review/entities/review.entity";
import { MediaEntity } from "./media.entity";

@Entity({ name: "reviews_videos", synchronize: true })
export class ReviewVideoEntity extends MediaEntity {
  @ManyToOne(() => ReviewEntity, (review) => review.Video, {
    onDelete: "CASCADE",
  })
  Review: ReviewEntity;
}
