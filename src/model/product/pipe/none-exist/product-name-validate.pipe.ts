import { Injectable, PipeTransform } from "@nestjs/common";
import { ProductValidator } from "../../logic/product.validator";

@Injectable()
export class ProductNameValidatePipe implements PipeTransform {
  constructor(private readonly productValidator: ProductValidator) {}

  public async transform(name: string): Promise<string> {
    await this.productValidator.isNoneExistName(name);

    return name;
  }
}
