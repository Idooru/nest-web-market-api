import { align, Align } from "../../../../common/types/align-by.type";
import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { warnEnumMessage } from "../../../../common/functions/none-enum";

type UserAlignColumn = "createdAt" | "role" | "nickName" | "email";
const userAlignColumn = ["createdAt", "role", "nickName", "email"];

export class FindAllUsersDto {
  @IsEnum(align, { message: warnEnumMessage(align) })
  @IsNotEmpty()
  public align: Align = "DESC";

  @IsOptional()
  @IsEnum(userAlignColumn, { message: warnEnumMessage(userAlignColumn) })
  public column: UserAlignColumn = "createdAt";
}
