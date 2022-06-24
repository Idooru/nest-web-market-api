import { UserEntity } from "./../../user/entities/user.entity";
import { ProductEntity } from "./../../product/product.entity";
import { IsNotEmpty, IsString } from "class-validator";
import { CommonEntity } from "../../../common/entities/common.entity";
import { Column, Entity, ManyToOne, OneToOne } from "typeorm";

@Entity("images")
export class ImagesEntity extends CommonEntity {
  @OneToOne(() => ProductEntity)
  imageForigenKeyForProduct: string;

  @ManyToOne(() => UserEntity)
  imageForigenKeyForUser: string;

  @Column({ type: "varchar", nullable: false, unique: true })
  imageFileName: string;

  @Column({ type: "varchar", nullable: false })
  uploader: string;
}

@Entity("videos")
export class VideosEntity extends CommonEntity {
  @Column({ type: "varchar", nullable: false, unique: true })
  videoFileName: string;

  @Column({ type: "varchar", nullable: false })
  uploader: string;
}
