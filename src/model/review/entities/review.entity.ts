import {
  Column,
  Entity,
  OneToMany,
  ManyToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import {
  ImagesEntity,
  VideosEntity,
} from "src/model/upload/entities/upload.entity";

import { UserEntity } from "./../../user/entities/user.entity";
import { ProductEntity } from "./../../product/entities/product.entity";
import { CommonEntity } from "src/common/entities/common.entity";
import { IsNotEmpty, IsString } from "class-validator";

@Entity("reviews")
export class ReviewEntity extends CommonEntity {
  @IsString()
  @IsNotEmpty()
  @Column({ type: "text", nullable: false })
  comments: string;

  @ManyToOne(() => UserEntity, (user) => user.Activity.Review)
  @JoinColumn({ name: "commenterId", referencedColumnName: "id" })
  Reviewer: UserEntity;

  @ManyToMany(() => ProductEntity, (product) => product.Review)
  Product: ProductEntity[];
}
