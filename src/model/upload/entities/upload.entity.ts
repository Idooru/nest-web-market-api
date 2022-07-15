import { UserEntity } from "src/model/user/entities/user.entity";
import { ProductEntity } from "./../../product/entities/product.entity";
import { CommonEntity } from "../../../common/entities/common.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { ReviewEntity } from "src/model/review/entities/review.entity";

@Entity("images")
export class ImagesEntity extends CommonEntity {
  @OneToOne(() => ProductEntity, (product) => product.Image)
  product: ProductEntity;

  @Column({ type: "varchar", nullable: false, unique: true })
  url: string;

  @Column({
    type: "enum",
    enum: ["product image", "product no image", "review", "inquiry"],
  })
  uploadReason: "product image" | "product no image" | "review" | "inquiry";

  @ManyToOne(() => UserEntity, (user) => user)
  @JoinColumn({ name: "uploaderId", referencedColumnName: "id" })
  uploader: UserEntity;

  @ManyToMany(() => ReviewEntity, (review) => review.Image)
  Review?: ReviewEntity[];
}

@Entity("videos")
export class VideosEntity extends CommonEntity {
  @Column({ type: "varchar", nullable: false, unique: true })
  url: string;

  @Column({ type: "enum", enum: ["review", "inquiry"] })
  uploadReason: "review" | "inquiry";

  @ManyToOne(() => UserEntity, (user) => user)
  @JoinColumn({ name: "uploaderId", referencedColumnName: "id" })
  uploader: UserEntity;
}
