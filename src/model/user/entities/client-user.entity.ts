import { InquiryRequestEntity } from "src/model/inquiry/entities/inquiry-request.entity";
import { ReviewEntity } from "src/model/review/entities/review.entity";
import { Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { UserEntity } from "./user.entity";
import { ChildEntity } from "src/common/entities/child.entity";
import { CartEntity } from "../../cart/entities/cart.entity";
import { PaymentEntity } from "../../payment/entities/payment.entity";

@Entity({ name: "client_users", synchronize: true })
export class ClientUserEntity extends ChildEntity {
  @OneToOne(() => UserEntity, (user) => user.clientActions, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "id" })
  User: UserEntity;

  @OneToMany(() => CartEntity, (cart) => cart.ClientUser)
  Cart: CartEntity[];

  @OneToMany(() => PaymentEntity, (payment) => payment.ClientUser)
  Payment: PaymentEntity[];

  @OneToMany(() => ReviewEntity, (review) => review.reviewer)
  writtenReview: ReviewEntity[];

  @OneToMany(
    () => InquiryRequestEntity,
    (inquiryRequest) => inquiryRequest.inquiryRequestWritter,
    { cascade: true },
  )
  writtenInquiryRequest: InquiryRequestEntity[];
}
