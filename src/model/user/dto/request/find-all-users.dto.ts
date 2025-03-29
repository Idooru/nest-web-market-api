import { order, Order } from "../../../../common/types/order-by.type";
import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { warnEnumMessage } from "../../../../common/functions/none-enum";

type UserOrderColumn = "createdAt" | "role" | "nickName" | "email";
const userOrderColumn = ["createdAt", "role", "nickName", "email"];

export class FindAllUsersDto {
  @IsEnum(order, { message: warnEnumMessage(order) })
  @IsNotEmpty()
  public order: Order = "DESC";

  @IsOptional()
  @IsEnum(userOrderColumn, { message: warnEnumMessage(userOrderColumn) })
  public column: UserOrderColumn = "createdAt";
}
