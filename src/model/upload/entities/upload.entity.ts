import { IsNotEmpty, IsString } from "class-validator";
import { CommonEntity } from "src/common/entities/common.entity";
import { Column, Entity } from "typeorm";

@Entity("images")
export class ImagesEntity extends CommonEntity {
  @IsString()
  @IsNotEmpty()
  @Column({ type: "varchar", nullable: false, unique: true })
  imageFileName: string;

  @IsString()
  @IsNotEmpty()
  @Column({ type: "varchar", nullable: false })
  uploader: string;

  @IsString()
  @IsNotEmpty()
  @Column({ type: "varchar", nullable: false, unique: true })
  imageOriginalFileName: string;
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

  @IsString()
  @IsNotEmpty()
  @Column({ type: "varchar", nullable: false, unique: true })
  videoOriginalFileName: string;
}
