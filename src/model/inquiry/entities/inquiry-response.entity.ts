import { IsEnum, IsNotEmpty } from "class-validator";
import { PostEntity } from "src/common/entities/post.entity";
import { InquiryResponseImageEntity } from "src/model/media/entities/inquiry-response-image.entity";
import { InquiryResponseVideoEntity } from "src/model/media/entities/inquiry-response-video.entity";
import { AdminUserEntity } from "src/model/user/entities/admin-user.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm";
import { InquiryRequestEntity } from "./inquiry-request.entity";

@Entity({ name: "inquiry_responses", synchronize: true })
export class InquiryResponseEntity extends PostEntity {
  @IsEnum(["product status", "delivery status", ""])
  @IsNotEmpty()
  @Column({ type: "enum", enum: ["product status", "delivery status"] })
  categories: "product status" | "delivery status";

  @ManyToOne(() => AdminUserEntity, (admin) => admin.writtenInquiryResponse)
  inquiryResponseWritter: AdminUserEntity;

  @OneToMany(
    () => InquiryResponseImageEntity,
    (image) => image.InquiryResponse,
    { cascade: true },
  )
  Image: InquiryResponseImageEntity[];

  @OneToMany(
    () => InquiryResponseVideoEntity,
    (video) => video.InquiryResponse,
    { cascade: true },
  )
  Video: InquiryResponseVideoEntity[];

  @OneToOne(
    () => InquiryRequestEntity,
    (inquiryRequest) => inquiryRequest.InquiryResponse,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "inquiryRequestId", referencedColumnName: "id" })
  InquiryRequest: InquiryRequestEntity;
}
