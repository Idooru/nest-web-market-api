import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { UserEntity } from "./user.entity";
import { ReviewEntity } from "src/model/review/entities/review.entity";
import { InquiryEntity } from "src/model/inquiry/entities/inquiry.entity";

@Entity("users_activity")
export class UserActivityEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => UserEntity, (user) => user.Activity, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId", referencedColumnName: "id" })
  User: UserEntity;

  @OneToMany(() => ReviewEntity, (review) => review.UserActivity, {
    cascade: true,
  })
  Review: ReviewEntity[];

  @OneToMany(() => InquiryEntity, (inquiry) => inquiry.UserActivity, {
    cascade: true,
  })
  Inquiry: InquiryEntity[];

  @Column({ type: "smallint", default: 0 })
  bonusPoint: number;

  @Column({ type: "smallint", default: 0 })
  purchaseCount: number;

  @Column({ type: "smallint", default: 0 })
  productReviewCount: number;

  @Column({ type: "smallint", default: 0 })
  productInquiryCount: number;
}
