import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty } from "class-validator";
import { AccountEntity } from "../../entities/account.entity";

export class AccountBody extends PickType(AccountEntity, ["bank", "accountNumber", "balance"] as const) {
  @ApiProperty({
    description: "사용자 계좌 은행 이름",
    example: "국민은행",
    required: true,
    uniqueItems: false,
  })
  public bank: "우리은행" | "농협은행" | "국민은행";

  @ApiProperty({
    description: "사용자 계좌 번호",
    example: "12345678-00-87654321",
    required: true,
    uniqueItems: true,
  })
  public accountNumber: string;

  @ApiProperty({
    description: "사용자 계좌 잔액",
    example: 500000,
    required: true,
    uniqueItems: false,
  })
  public balance: number;

  @IsBoolean()
  @IsNotEmpty()
  public isMainAccount: boolean;
}
