import { Injectable, PipeTransform } from "@nestjs/common";
import { ProductValidator } from "../../logic/product.validator";
import { ProductBodyDto } from "../../dto/product-body.dto";

@Injectable()
export class ProductNameValidatePipe implements PipeTransform {
  constructor(private readonly productValidator: ProductValidator) {}

  public async transform(value: ProductBodyDto): Promise<ProductBodyDto> {
    await this.productValidator.isNoneExistName(value.name);

    return value;
  }
}
