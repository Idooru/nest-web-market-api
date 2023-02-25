import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { CommonEntity } from "src/common/entities/common.entity";
import { ProductEntity } from "src/model/product/entities/product.entity";
import { UserEntity } from "src/model/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { UserActivityEntity } from "src/model/user/entities/user.activity.entity";
import { InquiryImageEntity } from "src/model/media/entities/inquiry.image.entity";
import { InquiryVideoEntity } from "src/model/media/entities/inquiry.video.entity";

@Entity("inquiries")
export class InquiryEntity extends CommonEntity {
  @IsString()
  @IsNotEmpty()
  @Column({ type: "text", nullable: false })
  inquiries: string;

  @IsEnum(["product status", "delivery status", ""])
  @IsNotEmpty()
  @Column({ type: "enum", enum: ["product status", "delivery status"] })
  categories: "product status" | "delivery status";

  @ManyToOne(() => UserEntity, (user) => user.Activity, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userActivityId" })
  UserActivity: UserActivityEntity;

  @ManyToOne(() => ProductEntity, (product) => product.Inquiry, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "productId" })
  Product: ProductEntity;

  @OneToMany(() => InquiryImageEntity, (image) => image.Inquiry, {
    cascade: true,
  })
  Image: InquiryImageEntity;

  @OneToMany(() => InquiryVideoEntity, (video) => video.Inquiry, {
    cascade: true,
  })
  Video: InquiryVideoEntity;
}
