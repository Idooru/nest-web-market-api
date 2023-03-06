import { CommonEntity } from "src/common/entities/common.entity";
import { IsEmail, IsUrl } from "class-validator";
import { Column } from "typeorm";

export class MediaEntity extends CommonEntity {
  @IsUrl()
  @Column({ type: "varchar", nullable: false, unique: true })
  url: string;

  @IsEmail()
  @Column({ type: "varchar", nullable: false })
  uploader: string;
}
