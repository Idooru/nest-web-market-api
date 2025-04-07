import { IsEnum, IsOptional } from "class-validator";
import { warnEnumMessage } from "../../../../common/functions/none-enum";
import { align, Align } from "../../../../common/types/align-by.type";

type ReviewAlignColumn = "createdAt" | "starRateScore";
const reviewAlignColumn = ["createdAt", "starRateScore"];

export class FindAllReviewsDto {
  @IsOptional()
  @IsEnum(align, { message: warnEnumMessage(align) })
  public align: Align = "DESC";

  @IsOptional()
  @IsEnum(reviewAlignColumn, { message: warnEnumMessage(reviewAlignColumn) })
  public column: ReviewAlignColumn = "createdAt";

  public userId: string;
}
