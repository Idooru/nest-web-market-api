import { MoneyTransactionDto } from "../../../account/dtos/request/money-transaction.dto";

export class WithdrawClientBalanceDto extends MoneyTransactionDto {
  public hasSurtax: boolean;
}
