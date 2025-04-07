import { ProductQuantity } from "../../types/product-quantity.type";

export class DepositAdminBalanceDto {
  public productQuantities: ProductQuantity[];
  public hasSurtax: boolean;
}

export class DepositAdminBalanceRowDto {
  public userId: string;
  public balance: number;
  public totalPrice: number;
  public hasSurtax: boolean;
}
