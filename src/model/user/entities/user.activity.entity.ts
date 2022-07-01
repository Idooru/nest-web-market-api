import { ReviewEntity } from "./../../review/entities/review.entity";
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
} from "typeorm";
import { UserEntity } from "./user.entity";

@Entity("users activity")
export class UserActivityEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "smallint", default: 0 })
  bonusPoint: number;

  @Column({ type: "smallint", default: 0 })
  purchaseCount: number;

  @Column({ type: "smallint", default: 0 })
  productInquiryCount: number;

  @Column({ type: "smallint", default: 0 })
  productReviewCount: number;

  @OneToOne(() => UserEntity)
  user: UserEntity;

  @OneToMany(() => ReviewEntity, (review) => review.commenter)
  review: ReviewEntity;
}
