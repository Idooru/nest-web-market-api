import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { CommonEntity } from "src/common/entities/common.entity";
import { ProductsEntity } from "src/model/product/entities/product.entity";
import { UsersEntity } from "src/model/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { InquiriesImageEntity } from "./inquiry.image.entity";
import { InquiriesVideoEntity } from "./inquiry.video.entity";

@Entity("inquiries")
export class InquiriesEntity extends CommonEntity {
  @IsString()
  @IsNotEmpty()
  @Column({ type: "text", nullable: false })
  inquiries: string;

  @IsEnum(["product status", "delivery status", ""])
  @IsNotEmpty()
  @Column({ type: "enum", enum: ["product status", "delivery status"] })
  categories: "product status" | "delivery status";

  @ManyToOne(() => UsersEntity, (user) => user)
  @JoinColumn({ name: "userId" })
  Inquirer: UsersEntity;

  @ManyToOne(() => ProductsEntity, (product) => product.Inquiry)
  @JoinColumn({ name: "productId" })
  Product: ProductsEntity;

  @OneToMany(() => InquiriesImageEntity, (image) => image.Inquiry)
  Image: InquiriesImageEntity;

  @OneToMany(() => InquiriesVideoEntity, (video) => video.Inquiry)
  Video: InquiriesVideoEntity;
}
