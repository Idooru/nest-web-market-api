import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { CommonEntity } from "src/common/entities/common.entity";
import { UserEntity } from "src/model/user/entities/user.entity";
import { ReviewEntity } from "src/model/review/entities/review.entity";

@Entity("reviews_videos")
export class ReviewVideoEntity extends CommonEntity {
  @Column({ type: "varchar", nullable: false, unique: true })
  url: string;

  @ManyToOne(() => ReviewEntity, (review) => review.Video, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "reviewId" })
  Review: ReviewEntity;

  @ManyToOne(() => UserEntity, (user) => user)
  @JoinColumn({ name: "userId" })
  uploader: UserEntity;
}
