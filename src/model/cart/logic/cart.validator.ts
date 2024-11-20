import { Injectable } from "@nestjs/common";
import { ValidateLibrary } from "../../../common/lib/util/validate.library";
import { CartValidateRepository } from "../repositories/cart-validate.repository";

@Injectable()
export class CartValidator {
  constructor(
    private readonly cartValidateRepository: CartValidateRepository,
    private readonly validateLibrary: ValidateLibrary,
  ) {}

  public async isExistId(id: string): Promise<void> {
    const result = await this.cartValidateRepository.validateId(id);
    this.validateLibrary.isExistData(result, "cart id", id);
  }
}
