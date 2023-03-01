import { OneToOne } from "typeorm";
import { UserAuthEntity } from "../../model/user/entities/user.auth.entity";
import { UserProfileEntity } from "../../model/user/entities/user.profile.entity";
import { CommonEntity } from "./common.entity";

export abstract class UserEntity extends CommonEntity {
  @OneToOne(() => UserProfileEntity, (profile) => profile.User, {
    cascade: true,
  })
  Profile: UserProfileEntity;

  @OneToOne(() => UserAuthEntity, (auth) => auth.User, {
    cascade: true,
  })
  Auth: UserAuthEntity;
}
