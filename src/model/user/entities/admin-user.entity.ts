import { UserPrototypeEntity } from "src/common/entities/user-prototype.entity";
import { InquiryEntity } from "src/model/inquiry/entities/inquiry.entity";
import { Entity, OneToMany } from "typeorm";

@Entity({ name: "admin-users", synchronize: true })
export class AdminUserEntity extends UserPrototypeEntity {
  @OneToMany(() => InquiryEntity, (inquiry) => inquiry.Admin)
  Inquiry: InquiryEntity[]; // 관리자 사용자가 문의를
}
