import { IsString } from "class-validator";
import { CommonEntity } from "src/common/entities/common.entity";
import { Column, Entity } from "typeorm";

@Entity("products")
export class Product extends CommonEntity {
  @IsString({ message: "" })
  @Column({ type: "varchar", length: 20, unique: true, nullable: false })
  name: string;

  @Column({ type: "number", unsigned: true, nullable: false })
  price: number;

  @Column({ type: "varchar", length: 20, nullable: false })
  origin: string;

  @Column({ type: "varchar", length: 20, nullable: false })
  type: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  description: string;

  @Column({ type: "number", default: 50 })
  stock: number;
}
