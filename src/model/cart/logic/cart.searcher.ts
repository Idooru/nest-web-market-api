import { BadRequestException, Injectable } from "@nestjs/common";
import { CartSearchRepository } from "../repositories/cart-search.repository";
import { loggerFactory } from "../../../common/functions/logger.factory";
import { CartsResponseDto } from "../dto/carts-response.dto";

@Injectable()
export class CartSearcher {
  constructor(private readonly cartSearchRepository: CartSearchRepository) {}

  public async findAllCarts(id: string): Promise<CartsResponseDto> {
    const carts = await this.cartSearchRepository.findAllCarts(id);
    const totalPrice = carts.map((cart) => cart.totalPrice).reduce((acc, cur) => acc + cur, 0);

    return {
      carts,
      totalPrice,
    };
  }

  public async validateProduct(clientId: string, productId: string): Promise<void> {
    const result = await this.cartSearchRepository.findProductOnCart(clientId, productId);

    if (result) {
      const message =
        "한 사용자가 같은 상품을 중복해서 장바구니에 올릴 수 없습니다. 상품이 필요하시다면 수량을 늘려주세요.";
      loggerFactory("Alread Exist").error(message);
      throw new BadRequestException(message);
    }
  }
}
