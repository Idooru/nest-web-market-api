import { ProductBody } from "./request/product-body.dto";
import { SearchModifyProductImageDto } from "./request/search-modify-product-image.dto";

export class SearchModifyProductDto extends SearchModifyProductImageDto {
  body: ProductBody;
}
