import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { IsEnum, IsNotEmpty, IsPositive, IsString, MaxLength, MinLength } from "class-validator";
import { CommonEntity } from "../../../common/entities/common.entity";
import { ClientUserEntity } from "../../user/entities/client-user.entity";
import { PaymentEntity } from "./payment.entity";
import { DeliveryOption, deliveryOption } from "../types/delivery-option.type";
import { warnEnumMessage } from "../../../common/functions/none-enum";
import { TransactionStatus, transactionStatus } from "../types/transaction-status.type";

@Entity({ name: "orders", synchronize: true })
export class OrderEntity extends CommonEntity {
  @IsEnum(deliveryOption, { message: warnEnumMessage(deliveryOption) })
  @IsNotEmpty()
  @Column({ type: "enum", enum: deliveryOption })
  public deliveryOption: DeliveryOption;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(50)
  @Column({ type: "varchar", length: 50, nullable: false })
  public deliveryAddress: string;

  @IsPositive()
  @IsNotEmpty()
  @Column({ type: "int", unsigned: true, nullable: false })
  public totalPrice: number;

  @IsEnum(transactionStatus, { message: warnEnumMessage(transactionStatus) })
  @IsNotEmpty()
  @Column({ type: "enum", enum: transactionStatus })
  public transactionStatus: TransactionStatus;

  @OneToMany(() => PaymentEntity, (payment) => payment.Order)
  public Payment: PaymentEntity[];

  @ManyToOne(() => ClientUserEntity, (clientUser) => clientUser.Order, { onDelete: "CASCADE" })
  @JoinColumn({ name: "clientId" })
  public ClientUser: ClientUserEntity;
}
