import { Entity, ManyToOne } from "typeorm";
import { RequestInquiryEntity } from "src/model/inquiry/entities/request-inquiry.entity";
import { MediaEntity } from "../../../common/entities/media.entity";

@Entity({ name: "request_inquiries_images", synchronize: true })
export class RequestInquiryImageEntity extends MediaEntity {
  @ManyToOne(() => RequestInquiryEntity, (inquiry) => inquiry.Image, {
    onDelete: "CASCADE",
  })
  Inquiry: RequestInquiryEntity;
}
