import { UserAuthEntity } from "src/model/user/entities/user.auth.entity";
import { ProductEntity } from "./../../product/product.entity";
import { CommonEntity } from "../../../common/entities/common.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

@Entity("images")
export class ImagesEntity extends CommonEntity {
  @OneToOne(() => ProductEntity, (product: ProductEntity) => product.image)
  product: ProductEntity;

  @Column({ type: "varchar", nullable: false, unique: true })
  uploadedImage: string;

  @ManyToOne(() => UserAuthEntity, (Join) => Join.image)
  @JoinColumn({ name: "uploaderId", referencedColumnName: "id" })
  uploader: UserAuthEntity;

  @Column({ type: "enum", enum: ["product upload", "review"] })
  uploadReason: "product upload" | "review";
}

@Entity("videos")
export class VideosEntity extends CommonEntity {
  @Column({ type: "varchar", nullable: false, unique: true })
  videoFileName: string;

  @Column({ type: "varchar", nullable: false })
  uploader: string;

  @Column({ type: "enum", default: "review", enum: ["review"] })
  uploadReason: "review";
}
