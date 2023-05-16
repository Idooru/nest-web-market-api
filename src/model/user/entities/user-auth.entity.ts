import { Column, Entity, OneToOne, JoinColumn } from "typeorm";
import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";
import { CommonEntity } from "src/common/entities/common.entity";
import { UserEntity } from "./user.entity";

@Entity({ name: "users_auth", synchronize: true })
export class UserAuthEntity extends CommonEntity {
  @OneToOne(() => UserEntity, (user) => user.Auth, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId", referencedColumnName: "id" })
  User: UserEntity;

  @IsString()
  @IsNotEmpty()
  @Column({ type: "varchar", length: 20, unique: true, nullable: false })
  nickname: string;

  @IsEmail()
  @IsNotEmpty()
  @Column({ type: "varchar", length: 60, unique: true, nullable: false })
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  @Column({ type: "varchar", nullable: false })
  password: string;
}
