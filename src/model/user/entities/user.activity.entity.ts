import { Column, Entity, PrimaryGeneratedColumn, OneToOne } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity("users activity")
export class UserActivityEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "smallint", default: 0 })
  point: number;

  @Column({ type: "smallint", default: 0 })
  howMuchBuy: number;

  @OneToOne(() => UserEntity, { onDelete: "CASCADE" })
  user: UserEntity;

  @Column({ type: "varchar" })
  productInquiry: string;

  @Column({ type: "varchar" })
  productReview: string;
}
