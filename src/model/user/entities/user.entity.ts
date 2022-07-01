import { CommonEntity } from "../../../common/entities/common.entity";
import { Entity, JoinColumn, OneToOne } from "typeorm";
import { UserAuthEntity } from "./user.auth.entity";
import { UserActivityEntity } from "./user.activity.entity";
import { UserProfileEntity } from "./user.profile.entity";

@Entity("users")
export class UserEntity extends CommonEntity {
  @OneToOne(() => UserProfileEntity, (common) => common.id)
  @JoinColumn({ name: "commonId", referencedColumnName: "id" })
  common: UserProfileEntity;

  @OneToOne(() => UserAuthEntity, (auth) => auth.id)
  @JoinColumn({ name: "authId", referencedColumnName: "id" })
  auth: UserAuthEntity;

  @OneToOne(() => UserActivityEntity, (activity) => activity.id)
  @JoinColumn({ name: "activityId", referencedColumnName: "id" })
  activity: UserActivityEntity;
}

("atoB");
("AtoB");
