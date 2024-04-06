import { Injectable, PipeTransform } from "@nestjs/common";
import { ProductValidator } from "../../logic/product.validator";
import { Implemented } from "../../../../common/decorators/implemented.decoration";

@Injectable()
export class ProductIdValidatePipe implements PipeTransform {
  constructor(private readonly productValidator: ProductValidator) {}

  @Implemented
  public async transform(id: string): Promise<string> {
    await this.productValidator.isExistId(id);

    return id;
  }
}
