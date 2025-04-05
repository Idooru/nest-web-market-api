import { IsEnum, IsOptional } from "class-validator";
import { warnEnumMessage } from "../../../../common/functions/none-enum";
import { align, Align } from "../../../../common/types/align-by.type";
import { DeliveryOption, deliveryOption } from "../../types/delivery-option.type";
import { TransactionStatus, transactionStatus } from "../../types/transaction-status.type";

type OrderAlignColumn = "createdAt" | "totalPrice";
const orderAlignColumn = ["createdAt", "totalPrice"];

export class FindAllOrdersDto {
  @IsOptional()
  @IsEnum(align, { message: warnEnumMessage(align) })
  public align: Align = "DESC";

  @IsOptional()
  @IsEnum(orderAlignColumn, { message: warnEnumMessage(orderAlignColumn) })
  public column: OrderAlignColumn = "createdAt";

  @IsOptional()
  @IsEnum(deliveryOption, { message: warnEnumMessage(deliveryOption) })
  public option: DeliveryOption;

  @IsOptional()
  @IsEnum(transactionStatus, { message: warnEnumMessage(transactionStatus) })
  public transactionStatus: TransactionStatus;

  public userId: string;
}
