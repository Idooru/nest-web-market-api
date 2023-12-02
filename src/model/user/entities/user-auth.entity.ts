import { Column, Entity, OneToOne, JoinColumn } from "typeorm";
import { IsEmail, IsJWT, IsNotEmpty, IsString, Matches } from "class-validator";
import { UserEntity } from "./user.entity";
import { ChildEntity } from "src/common/entities/child.entity";

@Entity({ name: "users_auth", synchronize: true })
export class UserAuthEntity extends ChildEntity {
  @OneToOne(() => UserEntity, (user) => user.Auth, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "id" })
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

  @IsJWT()
  @Column({ type: "text", nullable: false })
  refreshToken: string;
}
