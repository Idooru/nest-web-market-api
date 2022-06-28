import { Column, Entity, PrimaryGeneratedColumn, OneToOne } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity("users activity")
export class UserActivityEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "smallint", default: 0 })
  bonusPoint: number;

  @Column({ type: "smallint", default: 0 })
  purchaseCount: number;

  @OneToOne(() => UserEntity, { onDelete: "CASCADE" })
  user: UserEntity;

  @Column({ type: "smallint", default: 0 })
  productInquiryCount: number;

  @Column({ type: "smallint", default: 0 })
  productReviewCount: number;
}
