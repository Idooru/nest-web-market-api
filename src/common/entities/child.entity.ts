import { IsUUID } from "class-validator";
import { DateEntity } from "./date.entity";
import { PrimaryColumn } from "typeorm";

export abstract class ChildEntity extends DateEntity {
  @IsUUID()
  @PrimaryColumn("uuid")
  public id: string;
}
