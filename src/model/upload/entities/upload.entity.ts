import { UserEntity } from "./../../user/entities/user.entity";
import { ProductEntity } from "./../../product/product.entity";
import { CommonEntity } from "../../../common/entities/common.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

@Entity("images")
export class ImagesEntity extends CommonEntity {
  @OneToOne(() => ProductEntity)
  product: ProductEntity;

  // @ManyToOne(() => UserEntity, (join) => join.image)
  // @JoinColumn({ name: "userId", referencedColumnName: "id" })
  // user: UserEntity;

  @Column({ type: "varchar", nullable: false, unique: true })
  uploadedImage: string;

  @ManyToOne(() => UserEntity, (Join) => Join.image)
  @JoinColumn({ name: "uploaderId", referencedColumnName: "id" })
  uploader: UserEntity;

  @Column({ type: "varchar", enum: ["product upload", "review"] })
  uploadPurpose: "product upload" | " review";
}

@Entity("videos")
export class VideosEntity extends CommonEntity {
  @Column({ type: "varchar", nullable: false, unique: true })
  videoFileName: string;

  @Column({ type: "varchar", nullable: false })
  uploader: string;

  @Column({ type: "varchar", default: "review", enum: ["review"] })
  uploadPurpose: "review";
}
