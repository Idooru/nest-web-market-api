import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { UserEntity } from "../../user/entities/user.entity";
import { CommonEntity } from "../../../common/entities/common.entity";
import { BankCategory, bankCategory } from "../types/bank.category.type";
import { warnEnumMessage } from "../../../common/functions/none-enum";

@Entity({ name: "accounts", synchronize: true })
export class AccountEntity extends CommonEntity {
  @ManyToOne(() => UserEntity, (user) => user.Account, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  public User: UserEntity;

  @IsEnum(bankCategory, { message: warnEnumMessage(bankCategory) })
  @IsNotEmpty()
  @Column({ type: "enum", enum: bankCategory })
  public bank: BankCategory;

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
