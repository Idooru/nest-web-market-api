import { IsUUID } from "class-validator";
import { PrimaryGeneratedColumn } from "typeorm";
import { DateEntity } from "./date.entity";

export abstract class CommonEntity extends DateEntity {
  @IsUUID()
  @PrimaryGeneratedColumn("uuid")
  id: string;
}
