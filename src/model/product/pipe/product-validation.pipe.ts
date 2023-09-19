import { Injectable, PipeTransform } from "@nestjs/common";
import { ProductSearcher } from "../logic/product.searcher";

type ProductFeild = {
  name?: string;
};

@Injectable()
export class ProductValidationPipe<T extends ProductFeild>
  implements PipeTransform
{
  constructor(private readonly productSearcher: ProductSearcher) {}

  public async transform(value: T): Promise<T> {
    if (value.name) {
      await this.validateName(value);
    }
    return value;
  }

  private async validateName({ name }: T): Promise<void> {
    await this.productSearcher.isInvalidProductName(name);
  }
}
