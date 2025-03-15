import { IsNotEmpty, IsUUID } from "class-validator";
import { DateEntity } from "./date.entity";
import { PrimaryColumn } from "typeorm";

export class ChildEntity extends DateEntity {
  @IsUUID()
  @IsNotEmpty()
  @PrimaryColumn("uuid")
  public id: string;
}
