import { UserAuthEntity } from "src/model/user/entities/user.auth.entity";
import { ProductEntity } from "./../../product/product.entity";
import { CommonEntity } from "../../../common/entities/common.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

@Entity("images", { synchronize: false })
export class ImagesEntity extends CommonEntity {
  @OneToOne(() => ProductEntity, (product: ProductEntity) => product, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  product: ProductEntity;

  @Column({ type: "varchar", nullable: false, unique: true })
  url: string;

  @ManyToOne(() => UserAuthEntity, (Join) => Join.image, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "uploaderId", referencedColumnName: "id" })
  uploader: UserAuthEntity;

  @Column({
    type: "enum",
    enum: ["product image", "product no image", "review", "inquiry"],
  })
  uploadReason: "product image" | "product no image" | "review" | "inquiry";
}

@Entity("videos")
export class VideosEntity extends CommonEntity {
  @Column({ type: "varchar", nullable: false, unique: true })
  uploadedVideo: string;

  @Column({ type: "varchar", nullable: false })
  uploader: string;

  @Column({ type: "enum", default: "review", enum: ["review", "Inquiry"] })
  uploadReason: "review";
}
