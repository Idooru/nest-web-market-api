import { IsNotEmpty, IsString, IsEnum, IsDateString, IsMobilePhone, MaxLength, MinLength } from "class-validator";
import { Column, Entity, OneToOne, JoinColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { ChildEntity } from "src/common/entities/child.entity";

@Entity({ name: "users_profile", synchronize: true })
export class UserProfileEntity extends ChildEntity {
  @OneToOne(() => UserEntity, (user) => user.Profile, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "id" })
  public User: UserEntity;

  @IsString()
  @IsNotEmpty()
  @Column({ type: "varchar", length: 20, nullable: false })
  public realName: string;

  @IsDateString()
  @IsNotEmpty()
  @Column({ type: "date", nullable: false })
  public birth: Date;

  @IsEnum(["male", "female"])
  @IsNotEmpty()
  @Column({ type: "enum", enum: ["male", "female"] })
  public gender: "male" | "female";

  @IsMobilePhone()
  @IsNotEmpty()
  @Column({ type: "varchar", length: 15, unique: true, nullable: false })
  public phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(50)
  @Column({ type: "varchar", length: 50, nullable: false })
  public address: string;
}
