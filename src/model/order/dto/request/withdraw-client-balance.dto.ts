import { ClientUserEntity } from "../../../user/entities/client-user.entity";

export class WithdrawClientBalanceDto {
  clientUser: ClientUserEntity;
  totalPrice: number;
}
