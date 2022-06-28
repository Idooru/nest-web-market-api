import { CommonEntity } from "../../../common/entities/common.entity";
import { Entity, JoinColumn, OneToOne } from "typeorm";
import { UserAuthEntity } from "./user.auth.entity";
import { UserActivityEntity } from "./user.activity.entity";
import { UserCommonEntity } from "./user.common.entity";

@Entity("users")
export class UserEntity extends CommonEntity {
  @OneToOne(() => UserCommonEntity, (join) => join.id)
  @JoinColumn({ name: "commonId" })
  common: UserCommonEntity;

  @OneToOne(() => UserAuthEntity, (join) => join.id)
  @JoinColumn({ name: "authId" })
  auth: UserAuthEntity;

  @OneToOne(() => UserActivityEntity, (join) => join.id)
  @JoinColumn({ name: "activityId" })
  activity: UserActivityEntity;
}