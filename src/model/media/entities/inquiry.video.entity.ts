import { Entity, ManyToOne } from "typeorm";
import { InquiryEntity } from "src/model/inquiry/entities/inquiry.entity";
import { MediaEntity } from "../../../common/entities/media.entity";

@Entity({ name: "inquiries_videos", synchronize: true })
export class InquiryVideoEntity extends MediaEntity {
  @ManyToOne(() => InquiryEntity, (inquiry) => inquiry.Image, {
    onDelete: "CASCADE",
  })
  Inquiry: InquiryEntity;
}
