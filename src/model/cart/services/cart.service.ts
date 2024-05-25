import { BadRequestException, Injectable } from "@nestjs/common";
import { CartUpdateRepository } from "../repositories/cart-update.repository";
import { UserSearcher } from "../../user/logic/user.searcher";
import { ProductSearcher } from "../../product/logic/product.searcher";
import { CartSearcher } from "../logic/cart.searcher";
import { CartBodyDto } from "../dto/cart-body.dto";
import { ModifyCartDto } from "../dto/modify-cart.dto";
import { loggerFactory } from "../../../common/functions/logger.factory";
import { General } from "../../../common/decorators/general.decoration";

@Injectable()
export class CartService {
  constructor(
    private readonly cartUpdateRepository: CartUpdateRepository,
    private readonly cartSearcher: CartSearcher,
    private readonly userSearcher: UserSearcher,
    private readonly productSearcher: ProductSearcher,
  ) {}

  @General
  public async createCart(productId: string, clientUserId: string, dto: CartBodyDto): Promise<void> {
    const { quantity, totalPrice } = dto;
    await this.cartSearcher.validateProduct(clientUserId, productId);

    const [clientUser, product] = await Promise.all([
      this.userSearcher.findClientUserObjectWithId(clientUserId),
      this.productSearcher.findProductWithId(productId),
    ]);

    if (product.price * quantity !== totalPrice) {
      const message = `상품의 총 가격이 가격과 수량의 곱과 같지 않습니다.`;
      loggerFactory("Not Same").error(message);
      throw new BadRequestException(message);
    }

    await this.cartUpdateRepository.createCart({
      product,
      clientUser,
      cartBodyDto: dto,
    });
  }

  @General
  public async modifyCartWithId(dto: ModifyCartDto): Promise<void> {
    const { productId } = dto;
    const { quantity, totalPrice } = dto.cartBodyDto;
    const product = await this.productSearcher.findProductWithId(productId);

    if (product.price * quantity !== totalPrice) {
      const message = `상품의 총 가격이 가격과 수량의 곱과 같지 않습니다.`;
      loggerFactory("Not Same").error(message);
      throw new BadRequestException(message);
    }

    await this.cartUpdateRepository.modifyCartWithId(dto);
  }

  @General
  public async deleteAllCartsWithUserId(id: string): Promise<void> {
    await this.cartUpdateRepository.deleteAllCartsWithUserId(id);
  }

  @General
  public async deleteCartWithId(id: string): Promise<void> {
    await this.cartUpdateRepository.deleteCartWithId(id);
  }
}
