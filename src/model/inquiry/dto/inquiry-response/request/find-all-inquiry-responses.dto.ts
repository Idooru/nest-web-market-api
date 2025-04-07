import { IsEnum, IsOptional } from "class-validator";
import { warnEnumMessage } from "../../../../../common/functions/none-enum";
import { align, Align } from "../../../../../common/types/align-by.type";

type InquiryResponseAlignColumn = "createdAt";
const inquiryResponseAlignColumn = ["createdAt"];

export class FindAllInquiryResponsesDto {
  @IsOptional()
  @IsEnum(align, { message: warnEnumMessage(align) })
  public align: Align = "DESC";

  @IsOptional()
  @IsEnum(inquiryResponseAlignColumn, { message: warnEnumMessage(inquiryResponseAlignColumn) })
  public column: InquiryResponseAlignColumn = "createdAt";

  public userId: string;
}
