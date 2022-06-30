import { CommonEntity } from "../../../common/entities/common.entity";
import { Entity, JoinColumn, OneToOne } from "typeorm";
import { UserAuthEntity } from "./user.auth.entity";
import { UserActivityEntity } from "./user.activity.entity";
import { UserCommonEntity } from "./user.common.entity";

@Entity("users", { synchronize: false })
export class UserEntity extends CommonEntity {
  @OneToOne(() => UserCommonEntity, (join) => join.id, { cascade: true })
  @JoinColumn({ name: "commonId" })
  common: UserCommonEntity;

  @OneToOne(() => UserAuthEntity, (join) => join.id, { cascade: true })
  @JoinColumn({ name: "authId" })
  auth: UserAuthEntity;

  @OneToOne(() => UserActivityEntity, (join) => join.id, { cascade: true })
  @JoinColumn({ name: "activityId" })
  activity: UserActivityEntity;
}
