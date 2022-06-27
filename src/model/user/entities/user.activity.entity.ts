import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
} from "typeorm";
import { ImagesEntity } from "../../upload/entities/upload.entity";
import { UserEntity } from "./user.entity";

@Entity("users activity")
export class UserActivityEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "smallint", default: 0 })
  point: number;

  @Column({ type: "smallint", default: 0 })
  howMuchBuy: number;

  @OneToOne(() => UserEntity)
  user: UserEntity;

  @OneToMany(() => ImagesEntity, (join) => join.uploader)
  image?: ImagesEntity;

  @Column({ type: "varchar" })
  imageId: string[];

  @Column({ type: "varchar" })
  videoId: string[];

  @Column({ type: "varchar" })
  productInquiry: string;

  @Column({ type: "varchar" })
  productReview: string;
}
