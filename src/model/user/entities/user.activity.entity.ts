import { ReviewEntity } from "./../../review/entities/review.entity";
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { UserEntity } from "./user.entity";

@Entity("users activity")
export class UserActivityEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => UserEntity, (user) => user.Activity)
  @JoinColumn({ name: "userId", referencedColumnName: "id" })
  User: UserEntity;

  @Column({ type: "smallint", default: 0 })
  bonusPoint: number;

  @Column({ type: "smallint", default: 0 })
  purchaseCount: number;

  @Column({ type: "smallint", default: 0 })
  productInquiryCount: number;

  @Column({ type: "smallint", default: 0 })
  productReviewCount: number;

  @OneToMany(() => ReviewEntity, (review) => review.Reviewer)
  Review: ReviewEntity;
}
