import { Injectable, PipeTransform } from "@nestjs/common";
import { CartValidator } from "../logic/cart.validator";
import { Implemented } from "../../../common/decorators/implemented.decoration";

@Injectable()
export class CartIdValidatePipe implements PipeTransform {
  constructor(private readonly cartValidator: CartValidator) {}

  @Implemented
  public async transform(id: string): Promise<string> {
    await this.cartValidator.isExistId(id);

    return id;
  }
}
