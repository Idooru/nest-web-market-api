import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { CommonEntity } from "src/common/entities/common.entity";
import { ProductEntity } from "src/model/product/entities/product.entity";
import { UserEntity } from "src/model/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { InquiryImageEntity } from "./inquiry.image.entity";
import { InquiryVideoEntity } from "./inquiry.video.entity";
import { UserActivityEntity } from "src/model/user/entities/user.activity.entity";

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

  @ManyToOne(() => UserEntity, (user) => user.Activity)
  @JoinColumn({ name: "userActivityId" })
  Inquirer: UserActivityEntity;

  @ManyToOne(() => ProductEntity, (product) => product.Inquiry)
  @JoinColumn({ name: "productId" })
  Product: ProductEntity;

  @OneToMany(() => InquiryImageEntity, (image) => image.Inquiry)
  Image: InquiryImageEntity;

  @OneToMany(() => InquiryVideoEntity, (video) => video.Inquiry)
  Video: InquiryVideoEntity;
}
