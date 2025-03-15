import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { IsNotEmpty, IsPositive, Max } from "class-validator";
import { ClientUserEntity } from "../../user/entities/client-user.entity";
import { ProductEntity } from "../../product/entities/product.entity";
import { CommonEntity } from "../../../common/entities/common.entity";
import { OrderEntity } from "./order.entity";

@Entity({ name: "payments", synchronize: true })
export class PaymentEntity extends CommonEntity {
  @IsPositive()
  @IsNotEmpty()
  @Max(50)
  @Column({ type: "int", unsigned: true })
  quantity: number;

  @IsPositive()
  @IsNotEmpty()
  @Column({ type: "int", unsigned: true, nullable: false })
  totalPrice: number;

  @ManyToOne(() => ClientUserEntity, (clientUser) => clientUser.Payment)
  @JoinColumn({ name: "clientId" })
  ClientUser: ClientUserEntity;

  @ManyToOne(() => OrderEntity, (order) => order.Payment)
  Order: OrderEntity;

  @ManyToOne(() => ProductEntity, (product) => product.Payment, {
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "productId" })
  Product: ProductEntity;
}
