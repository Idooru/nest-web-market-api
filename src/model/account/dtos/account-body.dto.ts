import { ApiProperty, PickType } from "@nestjs/swagger";
import { AccountEntity } from "../entities/account.entity";

export class AccountBodyDto extends PickType(AccountEntity, [
  "bank",
  "accountNumber",
] as const) {
  @ApiProperty({
    description: "사용자 계좌 은행 이름",
    example: "국민은행",
    required: true,
    uniqueItems: false,
  })
  bank: "우리은행" | "농협은행" | "국민은행";

  @ApiProperty({
    description: "사용자 계좌 번호",
    example: "12345678-00-87654321",
    required: true,
    uniqueItems: true,
  })
  accountNumber: string;

  @ApiProperty({
    description: "사용자 계좌 잔액",
    example: 500000,
    required: true,
    uniqueItems: false,
  })
  balance: number;
}
