import { ReviewEntity } from "./../../review/entities/review.entity";
import { UserEntity } from "src/model/user/entities/user.entity";
import { ProductEntity } from "./../../product/product.entity";
import { CommonEntity } from "../../../common/entities/common.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

@Entity("images")
export class ImagesEntity extends CommonEntity {
  @OneToOne(() => ProductEntity, (product: ProductEntity) => product)
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

  @ManyToOne(() => ReviewEntity, (review) => review.image)
  @JoinColumn({ name: "reviewId", referencedColumnName: "id" })
  review: ReviewEntity;
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

  @ManyToOne(() => ReviewEntity, (review) => review.image)
  @JoinColumn({ name: "reviewId", referencedColumnName: "id" })
  review: ReviewEntity;
}
