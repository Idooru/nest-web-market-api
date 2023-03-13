import { IsUUID } from "class-validator";
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export abstract class CommonEntity {
  @IsUUID()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn({ type: "timestamp", select: false })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", select: false })
  updatedAt: Date;

  @DeleteDateColumn({ type: "timestamp", select: false })
  deletedAt: Date | null;
}
