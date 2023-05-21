import { IsNotEmpty } from "class-validator";
import { AdminUserEntity } from "src/model/user/entities/admin-user.entity";
import { ClientUserEntity } from "src/model/user/entities/client-user.entity";
import { Column, Entity, OneToOne } from "typeorm";
import { UserAuthEntity } from "./user-auth.entity";
import { UserProfileEntity } from "./user-profile.entity";
import { CommonEntity } from "../../../common/entities/common.entity";

@Entity({ name: "users", synchronize: true })
export class UserEntity extends CommonEntity {
  @IsNotEmpty()
  @Column({ type: "enum", enum: ["client", "admin"] })
  role: ["client", "admin"];

  @OneToOne(() => UserProfileEntity, (profile) => profile.User, {
    cascade: true,
  })
  Profile: UserProfileEntity;

  @OneToOne(() => UserAuthEntity, (auth) => auth.User, {
    cascade: true,
  })
  Auth: UserAuthEntity;

  @OneToOne(() => ClientUserEntity, (client) => client.User, {
    cascade: true,
  })
  clientActions: ClientUserEntity;

  @OneToOne(() => AdminUserEntity, (admin) => admin.User, {
    cascade: true,
  })
  adminActions: AdminUserEntity;
}
