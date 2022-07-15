import { CommonEntity } from "../../../common/entities/common.entity";
import { Entity, OneToOne, OneToMany } from "typeorm";
import { UserAuthEntity } from "./user.auth.entity";
import { UserActivityEntity } from "./user.activity.entity";
import { UserProfileEntity } from "./user.profile.entity";
import { ReviewEntity } from "src/model/review/entities/review.entity";

@Entity("users")
export class UserEntity extends CommonEntity {
  @OneToOne(() => UserProfileEntity, (profile) => profile.User)
  Profile: UserProfileEntity;

  @OneToOne(() => UserAuthEntity, (auth) => auth.User)
  Auth: UserAuthEntity;

  @OneToOne(() => UserActivityEntity, (activity) => activity.User)
  Activity: UserActivityEntity;

  @OneToMany(() => ReviewEntity, (review) => review.Reviewer)
  Review: ReviewEntity;
}
