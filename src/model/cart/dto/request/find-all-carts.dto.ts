import { IsEnum, IsOptional } from "class-validator";
import { warnEnumMessage } from "../../../../common/functions/none-enum";
import { align, Align } from "../../../../common/types/align-by.type";

type CartAlignColumn = "createdAt" | "quantity" | "totalPrice";
const cartAlignColumn = ["createdAt", "quantity", "totalPrice"];

export class FindAllCartsDto {
  @IsOptional()
  @IsEnum(align, { message: warnEnumMessage(align) })
  public align: Align = "DESC";

  @IsOptional()
  @IsEnum(cartAlignColumn, { message: warnEnumMessage(cartAlignColumn) })
  public column: CartAlignColumn = "createdAt";

  public userId: string;
}
