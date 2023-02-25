import { Entity, JoinColumn, ManyToOne, Column } from "typeorm";
import { CommonEntity } from "src/common/entities/common.entity";
import { UserEntity } from "src/model/user/entities/user.entity";
import { InquiryEntity } from "src/model/inquiry/entities/inquiry.entity";

@Entity("inquiries_videos")
export class InquiryVideoEntity extends CommonEntity {
  @Column({ type: "varchar", nullable: false, unique: true })
  url: string;

  @ManyToOne(() => InquiryEntity, (inquiry) => inquiry.Image, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "inquiryId" })
  Inquiry: InquiryEntity;

  @ManyToOne(() => UserEntity, (user) => user)
  @JoinColumn({ name: "userId" })
  uploader: UserEntity;
}
