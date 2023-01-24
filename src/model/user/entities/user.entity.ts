import { CommonEntity } from "../../../common/entities/common.entity";
import { Entity, OneToOne } from "typeorm";
import { UserAuthEntity } from "./user.auth.entity";
import { UserActivityEntity } from "./user.activity.entity";
import { UserProfileEntity } from "./user.profile.entity";

@Entity("users")
export class UserEntity extends CommonEntity {
  @OneToOne(() => UserProfileEntity, (profile) => profile.User, {
    cascade: true,
  })
  Profile: UserProfileEntity;

  @OneToOne(() => UserAuthEntity, (auth) => auth.User, {
    cascade: true,
  })
  Auth: UserAuthEntity;

  @OneToOne(() => UserActivityEntity, (activity) => activity.User, {
    cascade: true,
  })
  Activity: UserActivityEntity;
}
