import {
  Column,
  Entity,
  OneToMany,
  ManyToMany,
  ManyToOne,
  JoinColumn,
  JoinTable,
  OneToOne,
} from "typeorm";
import {
  ImagesEntity,
  VideosEntity,
} from "src/model/upload/entities/upload.entity";
import { UserEntity } from "./../../user/entities/user.entity";
import { ProductEntity } from "./../../product/entities/product.entity";
import { CommonEntity } from "src/common/entities/common.entity";
import { IsNotEmpty, IsString, IsEnum } from "class-validator";
import { StarRatingEntity } from "./star-rating.entity";

@Entity("reviews")
export class ReviewEntity extends CommonEntity {
  @IsString()
  @IsNotEmpty()
  @Column({ type: "text", nullable: false })
  comments: string;

  @IsEnum([1, 2, 3, 4, 5])
  @IsNotEmpty()
  @Column({ type: "enum", enum: [1, 2, 3, 4, 5] })
  userSelectScore: 1 | 2 | 3 | 4 | 5;

  @ManyToOne(() => UserEntity, (user) => user)
  @JoinColumn({ name: "commenterId", referencedColumnName: "id" })
  Reviewer: UserEntity;

  @ManyToOne(() => ProductEntity, (product) => product.Review)
  @JoinColumn({ name: "productId", referencedColumnName: "id" })
  Product: ProductEntity;

  @ManyToOne(() => ImagesEntity, (image) => image.Review)
  @JoinColumn({ name: "imageId", referencedColumnName: "id" })
  Image?: ImagesEntity[];

  @ManyToOne(() => VideosEntity, (video) => video.Review)
  @JoinColumn({ name: "videoId", referencedColumnName: "id" })
  Video?: VideosEntity[];
}
