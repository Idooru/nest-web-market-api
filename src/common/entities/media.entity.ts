import { IsEmail, IsString, IsUrl } from "class-validator";
import { Column } from "typeorm";
import { ChildEntity } from "./child.entity";

export abstract class MediaEntity extends ChildEntity {
  @IsUrl()
  @IsString()
  @Column({ type: "varchar", nullable: false, unique: true })
  url: string;

  @IsEmail()
  @IsString()
  @Column({ type: "varchar", nullable: false })
  uploader: string;
}
