import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { UsersEntity } from "./user.entity";

@Entity("users_activity")
export class UserActivityEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => UsersEntity, (user) => user.Activity)
  @JoinColumn({ name: "userId", referencedColumnName: "id" })
  User: UsersEntity;

  @Column({ type: "smallint", default: 0 })
  bonusPoint: number;

  @Column({ type: "smallint", default: 0 })
  purchaseCount: number;

  @Column({ type: "smallint", default: 0 })
  productReviewCount: number;

  @Column({ type: "smallint", default: 0 })
  productInquiryCount: number;
}
