import { ProductBody } from "./product-body.dto";
import { SearchModifyProductImageDto } from "./search-modify-product-image.dto";

export class SearchModifyProductDto extends SearchModifyProductImageDto {
  body: ProductBody;
}
