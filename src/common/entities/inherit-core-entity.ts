import { OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserCoreEntity } from "src/model/user/entities/user.core.entity";
import { IsUUID } from "class-validator";

export abstract class InheritUserCoreEntity {
  @IsUUID()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => UserCoreEntity)
  core: UserCoreEntity;
}
