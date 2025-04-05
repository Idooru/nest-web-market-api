import { PostEntity } from "src/common/entities/post.entity";
import { InquiryResponseImageEntity } from "src/model/media/entities/inquiry-response-image.entity";
import { InquiryResponseVideoEntity } from "src/model/media/entities/inquiry-response-video.entity";
import { AdminUserEntity } from "src/model/user/entities/admin-user.entity";
import { Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { InquiryRequestEntity } from "./inquiry-request.entity";

@Entity({ name: "inquiry_responses", synchronize: true })
export class InquiryResponseEntity extends PostEntity {
  @ManyToOne(() => AdminUserEntity, (admin) => admin.InquiryResponse, {
    onDelete: "CASCADE",
  })
  public AdminUser: AdminUserEntity;

  @OneToMany(() => InquiryResponseImageEntity, (image) => image.InquiryResponse, { cascade: true })
  public InquiryResponseImage?: InquiryResponseImageEntity[];

  @OneToMany(() => InquiryResponseVideoEntity, (video) => video.InquiryResponse, { cascade: true })
  public InquiryResponseVideo?: InquiryResponseVideoEntity[];

  @OneToOne(() => InquiryRequestEntity, (inquiryRequest) => inquiryRequest.InquiryResponse, { onDelete: "SET NULL" })
  @JoinColumn({ name: "inquiryRequestId", referencedColumnName: "id" })
  public InquiryRequest: InquiryRequestEntity;
}
