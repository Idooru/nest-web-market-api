import { ImagesEntity } from "../../upload/entities/upload.entity";
import { UserEntity } from "./user.core.entity";
import { InheritUserEntity } from "src/common/entities/inherit-core-entity";

import { Column, Entity, OneToMany, OneToOne } from "typeorm";

@Entity("users activity")
export class UserActivityEntity extends InheritUserEntity {
  @OneToOne(() => UserEntity)
  core: UserEntity;

  @Column({ type: "smallint", default: 0 })
  point: number;

  @Column({ type: "smallint", default: 0 })
  howMuchBuy: number;

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
