import { Injectable, PipeTransform } from "@nestjs/common";
import { ProductValidator } from "../../logic/product.validator";
import { ProductBodyDto } from "../../dto/product-body.dto";
import { Implemented } from "../../../../common/decorators/implemented.decoration";

@Injectable()
export class ProductNameValidatePipe implements PipeTransform {
  constructor(private readonly productValidator: ProductValidator) {}

  @Implemented
  public async transform(value: ProductBodyDto): Promise<ProductBodyDto> {
    await this.productValidator.isNoneExistName(value.name);

    return value;
  }
}
