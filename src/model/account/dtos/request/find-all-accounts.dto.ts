import { IsEnum, IsOptional } from "class-validator";
import { warnEnumMessage } from "../../../../common/functions/none-enum";
import { align, Align } from "../../../../common/types/align-by.type";

type AccountAlignColumn = "createdAt" | "balance";
const accountAlignColumn = ["createdAt", "balance"];

export class FindAllAccountsDto {
  @IsOptional()
  @IsEnum(align, { message: warnEnumMessage(align) })
  public align: Align = "DESC";

  @IsOptional()
  @IsEnum(accountAlignColumn, { message: warnEnumMessage(accountAlignColumn) })
  public column: AccountAlignColumn = "createdAt";

  public userId: string;
}
