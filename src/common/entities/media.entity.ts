import { IsInt, IsString, IsUrl } from "class-validator";
import { Column } from "typeorm";
import { CommonEntity } from "./common.entity";

export abstract class MediaEntity extends CommonEntity {
  @IsUrl()
  @IsString()
  @Column({ type: "varchar", nullable: false, unique: true })
  url: string;

  @IsInt()
  @Column({ type: "int", nullable: false, unique: false })
  size: number;
}
