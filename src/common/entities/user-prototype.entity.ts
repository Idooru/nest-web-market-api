import { Column, Entity, OneToOne } from "typeorm";
import { UserAuthEntity } from "../../model/user/entities/user.auth.entity";
import { UserProfileEntity } from "../../model/user/entities/user.profile.entity";
import { CommonEntity } from "./common.entity";

@Entity({ name: "users_prototype", synchronize: true })
export class UserPrototypeEntity extends CommonEntity {
  @Column({ type: "enum", enum: ["client", "admin"] })
  userType: ["client", "admin"];

  @OneToOne(() => UserProfileEntity, (profile) => profile.UserPrototype, {
    cascade: true,
  })
  Profile: UserProfileEntity;

  @OneToOne(() => UserAuthEntity, (auth) => auth.UserPrototype, {
    cascade: true,
  })
  Auth: UserAuthEntity;
}
