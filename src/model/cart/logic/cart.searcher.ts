import { BadRequestException, Injectable } from "@nestjs/common";
import { CartSearchRepository } from "../repositories/cart-search.repository";
import { CartEntity } from "../entities/cart.entity";
import { loggerFactory } from "../../../common/functions/logger.factory";

@Injectable()
export class CartSearcher {
  constructor(private readonly cartSearchRepository: CartSearchRepository) {}

  public async findCartsWithId(id: string): Promise<CartEntity[]> {
    return await this.cartSearchRepository.findCartsWithId(id);
  }

  public async validateProduct(id: string): Promise<void> {
    const result = await this.cartSearchRepository.findProductOnCart(id);

    if (result) {
      const message =
        "같은 상품을 중복해서 장바구니에 올릴 수 없습니다. 상품이 필요하시다면 수량을 늘려주세요.";
      loggerFactory("Alread Exist").error(message);
      throw new BadRequestException(message);
    }
  }
}
