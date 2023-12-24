import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { CommonEntity } from "../../../common/entities/common.entity";
import { ProductEntity } from "../../product/entities/product.entity";
import { ClientUserEntity } from "../../user/entities/client-user.entity";
import { IsNotEmpty, IsPositive, Max } from "class-validator";

@Entity({ name: "carts", synchronize: true })
export class CartEntity extends CommonEntity {
  @IsPositive()
  @IsNotEmpty()
  @Max(50)
  @Column({ type: "int", unsigned: true })
  quantity: number;

  @IsPositive()
  @IsNotEmpty()
  @Column({ type: "int", unsigned: true, nullable: false })
  totalPrice: number;

  @ManyToOne(() => ClientUserEntity, (clientUser) => clientUser.cart)
  @JoinColumn({ name: "clientId" })
  clientUser: ClientUserEntity;

  @ManyToOne(() => ProductEntity, (product) => product.cart)
  @JoinColumn({ name: "productId" })
  product: ProductEntity;
}
