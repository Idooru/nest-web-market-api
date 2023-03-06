import { Entity, ManyToOne } from "typeorm";
import { InquiryEntity } from "src/model/inquiry/entities/inquiry.entity";
import { MediaEntity } from "./media.entity";

@Entity({ name: "inquiries_images", synchronize: true })
export class InquiryImageEntity extends MediaEntity {
  @ManyToOne(() => InquiryEntity, (inquiry) => inquiry.Image, {
    onDelete: "CASCADE",
  })
  Inquiry: InquiryEntity;
}
