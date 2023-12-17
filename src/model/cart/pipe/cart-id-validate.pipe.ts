import { Injectable, PipeTransform } from "@nestjs/common";
import { CartValidator } from "../logic/cart.validator";

@Injectable()
export class CartIdValidatePipe implements PipeTransform {
  constructor(private readonly cartValidator: CartValidator) {}

  public async transform(id: string): Promise<string> {
    await this.cartValidator.isExistId(id);

    return id;
  }
}
