import { OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "src/model/user/entities/user.core.entity";
import { IsUUID } from "class-validator";

export abstract class InheritUserEntity {
  @IsUUID()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => UserEntity, (join) => join.id, { onDelete: "CASCADE" })
  core: UserEntity;
}
