import { Entity, ManyToOne, Column, JoinColumn } from "typeorm";
import { CommonEntity } from "src/common/entities/common.entity";
import { ReviewEntity } from "src/model/review/entities/review.entity";
import { UserEntity } from "src/model/user/entities/user.entity";

@Entity("reviews_images")
export class ReviewsImageEntity extends CommonEntity {
  @ManyToOne(() => ReviewEntity, (review) => review.Image)
  @JoinColumn({ name: "reviewId" })
  Review: ReviewEntity;

  @Column({ type: "varchar", nullable: false, unique: true })
  url: string;

  @ManyToOne(() => UserEntity, (user) => user)
  @JoinColumn({ name: "uploaderId" })
  uploader: UserEntity;
}
