import { Injectable, NotFoundException } from "@nestjs/common";
import { ProductSearcher } from "./product.searcher";

@Injectable()
export class ProductValidator {
  async validate(
    productSearcher: ProductSearcher,
    name: string,
  ): Promise<void> {
    const validResult = await Promise.allSettled([
      productSearcher.isInvalidProductName(name),
    ]);

    const errors = validResult.filter((item) => item.status === "rejected");

    if (errors.length) {
      throw new NotFoundException(errors);
    }
  }
}
