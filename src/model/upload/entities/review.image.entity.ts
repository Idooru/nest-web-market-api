import { Entity, ManyToOne, Column, JoinColumn } from "typeorm";
import { CommonEntity } from "src/common/entities/common.entity";
import { ReviewEntity } from "src/model/review/entities/review.entity";
import { UserEntity } from "src/model/user/entities/user.entity";

@Entity("reviews_images")
export class ReviewImageEntity extends CommonEntity {
  @Column({ type: "varchar", nullable: false, unique: true })
  url: string;

  @ManyToOne(() => ReviewEntity, (review) => review.Image, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "reviewId" })
  Review: ReviewEntity;

  @ManyToOne(() => UserEntity, (user) => user)
  @JoinColumn({ name: "userId" })
  uploader: UserEntity;
}
