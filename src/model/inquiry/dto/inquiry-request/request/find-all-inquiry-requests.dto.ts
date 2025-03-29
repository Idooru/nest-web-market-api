import { IsEnum, IsOptional } from "class-validator";
import { order, Order } from "../../../../../common/types/order-by.type";
import { warnEnumMessage } from "../../../../../common/functions/none-enum";
import { inquiryOption, InquiryOption } from "../../../types/inquiry-option.type";

type InquiryRequestOrderColumn = "createdAt";
const inquiryRequestOrderColumn = ["createdAt"];

type IsAnsweredWhether = "done" | "yet";
const isAnsweredWhether = ["done", "yet"];

export class FindAllInquiryRequestsDto {
  @IsOptional()
  @IsEnum(order, { message: warnEnumMessage(order) })
  public order: Order = "DESC";

  @IsOptional()
  @IsEnum(inquiryRequestOrderColumn, { message: warnEnumMessage(inquiryRequestOrderColumn) })
  public column: InquiryRequestOrderColumn = "createdAt";

  @IsOptional()
  @IsEnum(inquiryOption, { message: warnEnumMessage(inquiryOption) })
  public option: InquiryOption;

  @IsOptional()
  @IsEnum(isAnsweredWhether, { message: warnEnumMessage(isAnsweredWhether) })
  public isAnswered: IsAnsweredWhether;

  public userId: string;
}
