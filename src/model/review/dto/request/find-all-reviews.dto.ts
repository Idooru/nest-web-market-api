import { IsEnum, IsOptional } from "class-validator";
import { warnEnumMessage } from "../../../../common/functions/none-enum";
import { order, Order } from "../../../../common/types/order-by.type";

type ReviewOrderColumn = "createdAt" | "starRateScore";
const reviewOrderColumn = ["createdAt", "starRateScore"];

export class FindAllReviewsDto {
  @IsOptional()
  @IsEnum(order, { message: warnEnumMessage(order) })
  public order: Order = "DESC";

  @IsOptional()
  @IsEnum(reviewOrderColumn, { message: warnEnumMessage(reviewOrderColumn) })
  public column: ReviewOrderColumn = "createdAt";

  public userId: string;
}
