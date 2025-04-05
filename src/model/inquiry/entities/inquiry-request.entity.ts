import { IsBoolean, IsEnum, IsNotEmpty } from "class-validator";
import { ProductEntity } from "src/model/product/entities/product.entity";
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { InquiryRequestImageEntity } from "src/model/media/entities/inquiry-request-image.entity";
import { InquiryRequestVideoEntity } from "src/model/media/entities/inquiry-request-video.entity";
import { ClientUserEntity } from "src/model/user/entities/client-user.entity";
import { PostEntity } from "src/common/entities/post.entity";
import { InquiryResponseEntity } from "./inquiry-response.entity";
import { InquiryOption, inquiryOption } from "../types/inquiry-option.type";
import { warnEnumMessage } from "../../../common/functions/none-enum";

@Entity({ name: "inquiry_requests", synchronize: true })
export class InquiryRequestEntity extends PostEntity {
  @IsEnum(inquiryOption, { message: warnEnumMessage(inquiryOption) })
  @IsNotEmpty()
  @Column({ type: "enum", enum: inquiryOption })
  public inquiryOption: InquiryOption;

  @ManyToOne(() => ClientUserEntity, (client) => client.InquiryRequest, { onDelete: "CASCADE" })
  public ClientUser: ClientUserEntity;

  @IsBoolean()
  @Column({ type: "boolean", default: false })
  public isAnswered: boolean;

  @ManyToOne(() => ProductEntity, (product) => product.InquiryRequest, { onDelete: "SET NULL" })
  public Product: ProductEntity;

  @OneToMany(() => InquiryRequestImageEntity, (image) => image.InquiryRequest, { cascade: true })
  public InquiryRequestImage: InquiryRequestImageEntity[];

  @OneToMany(() => InquiryRequestVideoEntity, (video) => video.InquiryRequest, { cascade: true })
  public InquiryRequestVideo: InquiryRequestVideoEntity[];

  @OneToOne(() => InquiryResponseEntity, (inquiryResponse) => inquiryResponse.InquiryRequest, { cascade: true })
  public InquiryResponse: InquiryResponseEntity;
}
