import { CommonEntity } from "src/common/entities/common.entity";
import { IsEmail, IsString, IsUrl } from "class-validator";
import { Column } from "typeorm";

export class MediaEntity extends CommonEntity {
  @IsUrl()
  @IsString()
  @Column({ type: "varchar", nullable: false, unique: true })
  url: string;

  @IsEmail()
  @IsString()
  @Column({ type: "varchar", nullable: false })
  uploader: string;
}
