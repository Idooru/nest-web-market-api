import { IsNotEmpty, IsUUID } from "class-validator";
import { PrimaryGeneratedColumn } from "typeorm";
import { DateEntity } from "./date.entity";

export class CommonEntity extends DateEntity {
  @IsUUID()
  @IsNotEmpty()
  @PrimaryGeneratedColumn("uuid")
  public id: string;
}
