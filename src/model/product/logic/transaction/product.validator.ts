import { BadRequestException, Injectable } from "@nestjs/common";
import { ProductSearcher } from "../product.searcher";

@Injectable()
export class ProductValidator {
  constructor(private readonly productSearcher: ProductSearcher) {}

  async validate(name: string): Promise<void> {
    const validResult = await Promise.allSettled([
      this.productSearcher.isInvalidProductName(name),
    ]);

    const errors = validResult.filter((item) => item.status === "rejected");

    if (errors.length) {
      throw new BadRequestException(errors);
    }
  }
}
