import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { CommonEntity } from "src/common/entities/common.entity";
import { UsersEntity } from "src/model/user/entities/user.entity";
import { ReviewsEntity } from "src/model/review/entities/review.entity";

@Entity("reviews_videos")
export class ReviewsVideoEntity extends CommonEntity {
  @Column({ type: "varchar", nullable: false, unique: true })
  url: string;

  @ManyToOne(() => UsersEntity, (user) => user)
  @JoinColumn({ name: "uploaderId" })
  uploader: UsersEntity;

  @ManyToOne(() => ReviewsEntity, (review) => review.Video)
  @JoinColumn({ name: "reviewId" })
  Review?: ReviewsEntity;
}
