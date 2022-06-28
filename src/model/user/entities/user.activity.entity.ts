import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import {
  ImagesEntity,
  VideosEntity,
} from "../../upload/entities/upload.entity";
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

  @ManyToOne(() => ImagesEntity, (join) => join.activity.id)
  @JoinColumn({ name: "uploadedImageId" })
  image?: ImagesEntity[];

  @ManyToOne(() => VideosEntity, (join) => join.activity.id)
  @JoinColumn({ name: "uploadedViedoId" })
  video?: VideosEntity[];

  // @Column({ type: "varchar" })
  // imageId: string[];

  // @Column({ type: "varchar" })
  // videoId: string[];
  @Column({ type: "varchar" })
  productInquiry: string;

  @Column({ type: "varchar" })
  productReview: string;
}
