import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { CommonEntity } from "src/common/entities/common.entity";
import { Column, Entity } from "typeorm";

@Entity("inquiries")
export class InquirysEntity extends CommonEntity {
  @IsString()
  @IsNotEmpty()
  @Column({ type: "text", nullable: false })
  inquiries: string;

  @IsEnum(["product status", "delivery status", ""])
  @IsNotEmpty()
  @Column({ type: "enum", enum: ["product status", "delivery status"] })
  categories: "product status" | "delivery status";
}
