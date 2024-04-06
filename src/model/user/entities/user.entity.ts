import { IsEnum, IsNotEmpty } from "class-validator";
import { AdminUserEntity } from "src/model/user/entities/admin-user.entity";
import { ClientUserEntity } from "src/model/user/entities/client-user.entity";
import { Column, Entity, OneToMany, OneToOne } from "typeorm";
import { UserAuthEntity } from "./user-auth.entity";
import { UserProfileEntity } from "./user-profile.entity";
import { CommonEntity } from "../../../common/entities/common.entity";
import { AccountEntity } from "../../account/entities/account.entity";

@Entity({ name: "users", synchronize: true })
export class UserEntity extends CommonEntity {
  @IsEnum(["client, admin"])
  @IsNotEmpty()
  @Column({ type: "enum", enum: ["client", "admin"] })
  public role: ["client", "admin"];

  @OneToOne(() => UserProfileEntity, (profile) => profile.User, {
    cascade: true,
  })
  public Profile: UserProfileEntity;

  @OneToOne(() => UserAuthEntity, (auth) => auth.User, {
    cascade: true,
  })
  public Auth: UserAuthEntity;

  @OneToMany(() => AccountEntity, (account) => account.User, {
    cascade: true,
  })
  public Account: AccountEntity[];

  @OneToOne(() => ClientUserEntity, (client) => client.User, {
    cascade: true,
  })
  public clientActions: ClientUserEntity;

  @OneToOne(() => AdminUserEntity, (admin) => admin.User, {
    cascade: true,
  })
  public adminActions: AdminUserEntity;
}
