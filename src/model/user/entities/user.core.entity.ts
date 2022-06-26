import { CommonEntity } from "../../../common/entities/common.entity";
import { Entity, JoinColumn, OneToOne } from "typeorm";
import { UserAuthEntity } from "./user.auth.entity";
import { UserActivityEntity } from "./user.activity.entity";
import { UserCommonEntity } from "./user.common.entity";

@Entity("users core")
export class UserCoreEntity extends CommonEntity {
  @OneToOne(() => UserCommonEntity, (join) => join.core)
  @JoinColumn({ name: "commonId" })
  commonId: UserCommonEntity;

  @OneToOne(() => UserAuthEntity, (join) => join.core)
  @JoinColumn({ name: "authId" })
  authId: UserAuthEntity;

  @OneToOne(() => UserActivityEntity, (join) => join.core)
  @JoinColumn({ name: "activityId" })
  activityId: UserActivityEntity;
}
