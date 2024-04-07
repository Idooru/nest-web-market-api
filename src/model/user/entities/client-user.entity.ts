import { InquiryRequestEntity } from "src/model/inquiry/entities/inquiry-request.entity";
import { ReviewEntity } from "src/model/review/entities/review.entity";
import { Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { UserEntity } from "./user.entity";
import { ChildEntity } from "src/common/entities/child.entity";
import { CartEntity } from "../../cart/entities/cart.entity";
import { OrderEntity } from "../../order/entities/order.entity";
import { PaymentEntitiy } from "../../order/entities/payment.entitiy";

@Entity({ name: "client_users", synchronize: true })
export class ClientUserEntity extends ChildEntity {
  @OneToOne(() => UserEntity, (user) => user.clientActions, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "id" })
  public User: UserEntity;

  @OneToMany(() => CartEntity, (cart) => cart.ClientUser)
  public Cart: CartEntity[];

  @OneToMany(() => OrderEntity, (order) => order.ClientUser)
  public Order: OrderEntity[];

  @OneToMany(() => PaymentEntitiy, (payment) => payment.ClientUser)
  public Payment: PaymentEntitiy[];

  @OneToMany(() => ReviewEntity, (review) => review.reviewer)
  public writtenReview: ReviewEntity[];

  @OneToMany(() => InquiryRequestEntity, (inquiryRequest) => inquiryRequest.inquiryRequestWritter, { cascade: true })
  public writtenInquiryRequest: InquiryRequestEntity[];
}
