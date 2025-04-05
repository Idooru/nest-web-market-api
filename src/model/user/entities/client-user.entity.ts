import { InquiryRequestEntity } from "src/model/inquiry/entities/inquiry-request.entity";
import { ReviewEntity } from "src/model/review/entities/review.entity";
import { Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { UserEntity } from "./user.entity";
import { ChildEntity } from "src/common/entities/child.entity";
import { CartEntity } from "../../cart/entities/cart.entity";
import { OrderEntity } from "../../order/entities/order.entity";
import { PaymentEntity } from "../../order/entities/payment.entity";

@Entity({ name: "client_users", synchronize: true })
export class ClientUserEntity extends ChildEntity {
  @OneToOne(() => UserEntity, (user) => user.ClientUser, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "id" })
  public User: UserEntity;

  @OneToMany(() => CartEntity, (cart) => cart.ClientUser, { cascade: true })
  public Cart: CartEntity[];

  @OneToMany(() => OrderEntity, (order) => order.ClientUser, { cascade: true })
  public Order: OrderEntity[];

  @OneToMany(() => PaymentEntity, (payment) => payment.ClientUser, { cascade: true })
  public Payment: PaymentEntity[];

  @OneToMany(() => ReviewEntity, (review) => review.ClientUser, {
    cascade: true,
  })
  public Review: ReviewEntity[];

  @OneToMany(() => InquiryRequestEntity, (inquiryRequest) => inquiryRequest.ClientUser, { cascade: true })
  public InquiryRequest: InquiryRequestEntity[];
}
