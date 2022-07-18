import { CommonEntity } from "../../../common/entities/common.entity";
import { Entity, OneToOne, OneToMany } from "typeorm";
import { UserAuthEntity } from "./user.auth.entity";
import { UserActivityEntity } from "./user.activity.entity";
import { UserProfileEntity } from "./user.profile.entity";
import { ReviewsEntity } from "src/model/review/entities/review.entity";
import { InquiriesEntity } from "../../inquiry/entities/inquiry.entity";

@Entity("users")
export class UsersEntity extends CommonEntity {
  @OneToOne(() => UserProfileEntity, (profile) => profile.User)
  Profile: UserProfileEntity;

  @OneToOne(() => UserAuthEntity, (auth) => auth.User)
  Auth: UserAuthEntity;

  @OneToOne(() => UserActivityEntity, (activity) => activity.User)
  Activity: UserActivityEntity;

  @OneToMany(() => ReviewsEntity, (review) => review.Reviewer)
  Review: ReviewsEntity;

  @OneToMany(() => InquiriesEntity, (inquiry) => inquiry.Inquirer)
  Inquiry: InquiriesEntity;
}
