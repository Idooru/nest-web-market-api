import { IsEnum, IsOptional } from "class-validator";
import { warnEnumMessage } from "../../../../common/functions/none-enum";
import { order, Order } from "../../../../common/types/order-by.type";

type ProductOrderColumn = "createdAt" | "name" | "price" | "review" | "score";
const productOrderColumn = ["createdAt", "name", "price", "review", "score"];

export class FindAllProductsDto {
  @IsOptional()
  @IsEnum(order, { message: warnEnumMessage(order) })
  public order: Order = "DESC";

  @IsOptional()
  @IsEnum(productOrderColumn, { message: warnEnumMessage(productOrderColumn) })
  public column: ProductOrderColumn = "createdAt";

  @IsOptional()
  public name: string;
}
