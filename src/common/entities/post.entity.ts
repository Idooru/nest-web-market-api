import { IsString } from "class-validator";
import { Column } from "typeorm";
import { CommonEntity } from "./common.entity";

export abstract class PostEntity extends CommonEntity {
  @IsString()
  @Column({ type: "varchar", length: 30, nullable: false })
  public title: string;

  @IsString()
  @Column({ type: "varchar", length: 200, nullable: false })
  public content: string;
}
