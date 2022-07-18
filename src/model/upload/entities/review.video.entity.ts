import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { CommonEntity } from "src/common/entities/common.entity";
import { UserEntity } from "src/model/user/entities/user.entity";
import { ReviewEntity } from "src/model/review/entities/review.entity";

@Entity("reviews_videos")
export class ReviewsVideoEntity extends CommonEntity {
  @Column({ type: "varchar", nullable: false, unique: true })
  url: string;

  @ManyToOne(() => UserEntity, (user) => user)
  @JoinColumn({ name: "uploaderId" })
  uploader: UserEntity;

  @ManyToOne(() => ReviewEntity, (review) => review.Video)
  @JoinColumn({ name: "reviewId" })
  Review?: ReviewEntity;
}
