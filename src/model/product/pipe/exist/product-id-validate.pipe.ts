import { Injectable, PipeTransform } from "@nestjs/common";
import { ProductValidator } from "../../logic/product.validator";

@Injectable()
export class ProductIdValidatePipe implements PipeTransform {
  constructor(private readonly productValidator: ProductValidator) {}

  public async transform(id: string): Promise<string> {
    await this.productValidator.isExistId(id);

    return id;
  }
}
