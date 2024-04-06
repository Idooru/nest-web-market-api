import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from "typeorm";

export abstract class DateEntity {
  @CreateDateColumn({ type: "timestamp", select: false })
  public createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", select: false })
  public updatedAt: Date;

  @DeleteDateColumn({ type: "timestamp", select: false })
  public deletedAt: Date | null;
}
