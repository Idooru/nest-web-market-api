import { InquiryRequestEntity } from "src/model/inquiry/entities/inquiry-request.entity";
import { ReviewEntity } from "src/model/review/entities/review.entity";
import { Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { UserEntity } from "./user.entity";
import { ChildEntity } from "src/common/entities/child.entity";
import { CartEntity } from "../../cart/entities/cart.entity";
import { OrderEntity } from "../../order/entities/order.entity";
import { PaymentEntity } from "../../order/entities/payment.entity";
import { ReviewImageEntity } from "src/model/media/entities/review-image.entity";

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

  @OneToMany(() => PaymentEntity, (payment) => payment.ClientUser)
  public Payment: PaymentEntity[];

  @OneToMany(() => ReviewEntity, (review) => review.reviewer, {
    cascade: true,
  })
  public writtenReview: ReviewEntity[];

  @OneToMany(() => ReviewImageEntity, (reviewImage) => reviewImage.uploader, {
    cascade: true,
  })
  public uploadedReviewImage: ReviewImageEntity[];

  @OneToMany(() => InquiryRequestEntity, (inquiryRequest) => inquiryRequest.InquiryRequester, { cascade: true })
  public writtenInquiryRequest: InquiryRequestEntity[];
}
