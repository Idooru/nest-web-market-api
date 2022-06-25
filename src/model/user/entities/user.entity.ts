import {
  ImagesEntity,
  VideosEntity,
} from "./../../upload/entities/upload.entity";
import { Exclude } from "class-transformer";
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsDateString,
  IsMobilePhone,
} from "class-validator";
import { CommonEntity } from "../../../common/entities/common.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity("users")
export class UserEntity extends CommonEntity {
  @IsString()
  @IsNotEmpty()
  @Column({ type: "varchar", length: 20, nullable: false })
  realName: string;

  @IsString()
  @IsNotEmpty()
  @Column({ type: "varchar", length: 20, unique: true, nullable: false })
  nickName: string;

  @IsDateString()
  @IsNotEmpty()
  @Column({ type: "date", nullable: false })
  birth: Date;

  @IsEnum(["male", "female"])
  @IsNotEmpty()
  @Column({ type: "enum", enum: ["male", "female"] })
  gender: "male" | "female";

  @IsString()
  @IsNotEmpty()
  @Column({ type: "varchar", length: 60, unique: true, nullable: false })
  email: string;

  @Exclude()
  @Column({ type: "varchar", nullable: false })
  password: string;

  @IsMobilePhone()
  @IsNotEmpty()
  @Column({ type: "varchar", length: 15, unique: true, nullable: false })
  phoneNumber: string;

  @Column({ type: "smallint", default: 0 })
  point: number;

  @Column({ type: "smallint", default: 0 })
  howMuchBuy: number;

  @Column({
    type: "enum",
    enum: ["general", "special", "admin"],
    default: "general",
  })
  userType: "general" | "special" | "admin";

  @OneToMany(() => ImagesEntity, (join) => join.uploader)
  image?: ImagesEntity;

  @Column({ type: "varchar" })
  imageId: string[];

  @Column({ type: "varchar" })
  vedioId: string[];

  // @Column()
  // writtenReview: string;
}
