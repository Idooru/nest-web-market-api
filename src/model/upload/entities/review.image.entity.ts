import { Entity, ManyToOne, Column, JoinColumn } from "typeorm";
import { CommonEntity } from "src/common/entities/common.entity";
import { ReviewsEntity } from "src/model/review/entities/review.entity";
import { UsersEntity } from "src/model/user/entities/user.entity";

@Entity("reviews_images")
export class ReviewsImageEntity extends CommonEntity {
  @Column({ type: "varchar", nullable: false, unique: true })
  url: string;

  @ManyToOne(() => ReviewsEntity, (review) => review.Image)
  @JoinColumn({ name: "reviewId" })
  Review: ReviewsEntity;

  @ManyToOne(() => UsersEntity, (user) => user)
  @JoinColumn({ name: "userId" })
  uploader: UsersEntity;
}
