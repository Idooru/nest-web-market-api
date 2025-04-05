import { IsEnum, IsNotEmpty } from "class-validator";
import { AdminUserEntity } from "src/model/user/entities/admin-user.entity";
import { ClientUserEntity } from "src/model/user/entities/client-user.entity";
import { Column, Entity, OneToMany, OneToOne } from "typeorm";
import { UserAuthEntity } from "./user-auth.entity";
import { UserProfileEntity } from "./user-profile.entity";
import { CommonEntity } from "../../../common/entities/common.entity";
import { AccountEntity } from "../../account/entities/account.entity";
import { UserRole, userRole } from "../types/user-role.type";

@Entity({ name: "users", synchronize: true })
export class UserEntity extends CommonEntity {
  @IsEnum(userRole)
  @IsNotEmpty()
  @Column({ type: "enum", enum: userRole })
  public role: UserRole;

  @OneToOne(() => UserProfileEntity, (profile) => profile.User, { cascade: true })
  public UserProfile: UserProfileEntity;

  @OneToOne(() => UserAuthEntity, (auth) => auth.User, { cascade: true })
  public UserAuth: UserAuthEntity;

  @OneToMany(() => AccountEntity, (account) => account.User, { cascade: true })
  public Account: AccountEntity[];

  @OneToOne(() => ClientUserEntity, (client) => client.User, { cascade: true })
  public ClientUser: ClientUserEntity;

  @OneToOne(() => AdminUserEntity, (admin) => admin.User, { cascade: true })
  public AdminUser: AdminUserEntity;
}
