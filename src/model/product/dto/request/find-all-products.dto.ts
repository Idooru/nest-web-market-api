import { IsEnum, IsOptional, IsString } from "class-validator";
import { warnEnumMessage } from "../../../../common/functions/none-enum";
import { align, Align } from "../../../../common/types/align-by.type";
import { ProductCategory, productCategory } from "../../types/product-category.type";

type ProductAlignColumn = "createdAt" | "name" | "price" | "review" | "score";
const productAlignColumn = ["createdAt", "name", "price", "review", "score"];

export class FindAllProductsDto {
  @IsOptional()
  @IsEnum(align, { message: warnEnumMessage(align) })
  public align: Align = "DESC";

  @IsOptional()
  @IsEnum(productAlignColumn, { message: warnEnumMessage(productAlignColumn) })
  public column: ProductAlignColumn = "createdAt";

  @IsOptional()
  @IsEnum(productCategory, { message: warnEnumMessage(productCategory) })
  public category: ProductCategory;

  @IsOptional()
  @IsString()
  public name: string;
}
