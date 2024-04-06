import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import { UserEntity } from "../../user/entities/user.entity";
import { CommonEntity } from "../../../common/entities/common.entity";

@Entity({ name: "accounts", synchronize: true })
export class AccountEntity extends CommonEntity {
  @ManyToOne(() => UserEntity, (user) => user.Account, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  public User: UserEntity;

  @IsEnum(["우리은행", "농협은행", "국민은행"])
  @IsNotEmpty()
  @Column({ type: "enum", enum: ["우리은행", "농협은행", "국민은행"] })
  public bank: "우리은행" | "농협은행" | "국민은행";

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(30)
  @Column({ type: "varchar", length: 30, nullable: false, unique: true })
  public accountNumber: string;

  @IsInt()
  @Column({ type: "int", unsigned: true, default: 0 })
  public balance: number;

  @IsBoolean()
  @Column({ type: "boolean", default: false })
  public isMainAccount: boolean;
}
