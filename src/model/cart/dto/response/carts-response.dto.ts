import { CartEntity } from "../../entities/cart.entity";

export class CartsResponseDto {
  public carts: CartEntity[];
  public totalPrice: number;
}
