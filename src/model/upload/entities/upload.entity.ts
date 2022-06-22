import { UserEntity } from "./../../user/entities/user.entity";
import { ProductEntity } from "./../../product/product.entity";
import { IsNotEmpty, IsString } from "class-validator";
import { CommonEntity } from "../../../common/entities/common.entity";
import { Column, Entity, ManyToOne, OneToOne, JoinColumn } from "typeorm";

@Entity("images")
export class ImagesEntity extends CommonEntity {
  @OneToOne(() => ProductEntity)
  imageForigenKeyForProduct: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  imageForigenKeyForUser: string;

  @IsString()
  @IsNotEmpty()
  @Column({ type: "varchar", nullable: false, unique: true })
  imageFileName: string;

  @IsString()
  @IsNotEmpty()
  @Column({ type: "varchar", nullable: false })
  uploader: string;
}

@Entity("videos")
export class VideosEntity extends CommonEntity {
  @IsString()
  @IsNotEmpty()
  @Column({ type: "varchar", nullable: false, unique: true })
  videoFileName: string;

  @IsString()
  @IsNotEmpty()
  @Column({ type: "varchar", nullable: false })
  uploader: string;
}
