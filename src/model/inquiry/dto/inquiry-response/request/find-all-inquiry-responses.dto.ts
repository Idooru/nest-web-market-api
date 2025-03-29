import { IsEnum, IsOptional } from "class-validator";
import { warnEnumMessage } from "../../../../../common/functions/none-enum";
import { order, Order } from "../../../../../common/types/order-by.type";

export class FindAllInquiryResponsesDto {
  @IsOptional()
  @IsEnum(order, { message: warnEnumMessage(order) })
  public order: Order = "DESC";

  public userId: string;
}
