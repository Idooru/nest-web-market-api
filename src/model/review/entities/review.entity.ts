import {
  Column,
  Entity,
  OneToMany,
  ManyToMany,
  ManyToOne,
  JoinColumn,
  JoinTable,
} from "typeorm";
import { UserEntity } from "./../../user/entities/user.entity";
import { ProductEntity } from "./../../product/product.entity";
import { CommonEntity } from "src/common/entities/common.entity";
import {
  ImagesEntity,
  VideosEntity,
} from "src/model/upload/entities/upload.entity";

@Entity("reviews")
export class ReviewEntity extends CommonEntity {
  @Column({ type: "text", nullable: false })
  comments: string;

  @ManyToOne(() => UserEntity, (user) => user.activity.review)
  @JoinColumn({ name: "commenterId", referencedColumnName: "id" })
  reviewer: UserEntity;

  @ManyToMany(() => ProductEntity, (product) => product.review)
  product: ProductEntity[];

  @OneToMany(() => ImagesEntity, (image) => image.review)
  image?: ImagesEntity[];

  @OneToMany(() => VideosEntity, (video) => video.review)
  video?: VideosEntity[];
}
