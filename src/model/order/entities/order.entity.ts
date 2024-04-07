import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { IsEnum, IsNotEmpty, IsPositive, IsString, MaxLength, MinLength } from "class-validator";
import { CommonEntity } from "../../../common/entities/common.entity";
import { ClientUserEntity } from "../../user/entities/client-user.entity";
import { PaymentEntitiy } from "./payment.entitiy";

@Entity({ name: "orders", synchronize: true })
export class OrderEntity extends CommonEntity {
  @IsEnum(["default", "speed", "safe"])
  @IsNotEmpty()
  @Column({ type: "enum", enum: ["default", "speed", "safe"] })
  deliveryOption: "default" | "speed" | "safe";

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(50)
  @Column({ type: "varchar", length: 50, nullable: false })
  deliveryAddress: string;

  @IsPositive()
  @IsNotEmpty()
  @Column({ type: "int", unsigned: true, nullable: false })
  totalPrice: number;

  @IsEnum(["success", "fail", "hold"])
  @IsNotEmpty()
  @Column({ type: "enum", enum: ["success", "fail", "hold"] })
  transactionStatus: "success" | "fail" | "hold";

  @OneToMany(() => PaymentEntitiy, (payment) => payment.Order)
  Payment: PaymentEntitiy[];

  @ManyToOne(() => ClientUserEntity, (clientUser) => clientUser.Order)
  @JoinColumn({ name: "clientId" })
  ClientUser: ClientUserEntity;
}
