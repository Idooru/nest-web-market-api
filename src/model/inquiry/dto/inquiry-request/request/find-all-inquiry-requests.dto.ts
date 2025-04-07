import { IsEnum, IsOptional } from "class-validator";
import { align, Align } from "../../../../../common/types/align-by.type";
import { warnEnumMessage } from "../../../../../common/functions/none-enum";
import { inquiryOption, InquiryOption } from "../../../types/inquiry-option.type";

type InquiryRequestAlignColumn = "createdAt";
const inquiryRequestAlignColumn = ["createdAt"];

type IsAnsweredWhether = "done" | "yet";
const isAnsweredWhether = ["done", "yet"];

export class FindAllInquiryRequestsDto {
  @IsOptional()
  @IsEnum(align, { message: warnEnumMessage(align) })
  public align: Align = "DESC";

  @IsOptional()
  @IsEnum(inquiryRequestAlignColumn, { message: warnEnumMessage(inquiryRequestAlignColumn) })
  public column: InquiryRequestAlignColumn = "createdAt";

  @IsOptional()
  @IsEnum(inquiryOption, { message: warnEnumMessage(inquiryOption) })
  public option: InquiryOption;

  @IsOptional()
  @IsEnum(isAnsweredWhether, { message: warnEnumMessage(isAnsweredWhether) })
  public isAnswered: IsAnsweredWhether;

  public userId: string;
}
