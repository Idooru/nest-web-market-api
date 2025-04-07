import { CartsBasicRawDto } from "./carts-basic-raw.dto";

export class CartsResponseDto {
  public cartRaws: CartsBasicRawDto[];
  public totalPrice: number;
}
