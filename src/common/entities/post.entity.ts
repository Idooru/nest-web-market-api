import { IsString } from "class-validator";
import { Column } from "typeorm";
import { CommonEntity } from "./common.entity";

export abstract class PostEntity extends CommonEntity {
  @IsString()
  @Column({ type: "varchar", length: 30, nullable: false })
  title: string;

  @IsString()
  @Column({ type: "varchar", length: 200, nullable: false })
  content: string;
}
