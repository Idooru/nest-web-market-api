import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from "typeorm";

export abstract class DateEntity {
  @CreateDateColumn({ type: "timestamp", select: false })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", select: false })
  updatedAt: Date;

  @DeleteDateColumn({ type: "timestamp", select: false })
  deletedAt: Date | null;
}
