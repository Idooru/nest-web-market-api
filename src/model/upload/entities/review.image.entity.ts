import { Entity, ManyToOne, Column, JoinColumn, OneToOne } from "typeorm";
import { CommonEntity } from "src/common/entities/common.entity";
import { ReviewsEntity } from "src/model/review/entities/review.entity";
import { UsersEntity } from "src/model/user/entities/user.entity";
import { ImagesEntity } from "./Images.entity";

@Entity("reviews_images")
export class ReviewsImageEntity extends CommonEntity {
  @OneToOne(() => ImagesEntity)
  Image: ImagesEntity;

  @ManyToOne(() => ReviewsEntity, (review) => review.Image)
  @JoinColumn({ name: "reviewId" })
  Review: ReviewsEntity;

  @Column({ type: "varchar", nullable: false, unique: true })
  url: string;

  @ManyToOne(() => UsersEntity, (user) => user)
  @JoinColumn({ name: "uploaderId" })
  uploader: UsersEntity;
}
