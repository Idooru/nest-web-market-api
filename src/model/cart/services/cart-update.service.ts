import { Injectable } from "@nestjs/common";
import { CartUpdateRepository } from "../repositories/cart-update.repository";
import { UserSearcher } from "../../user/logic/user.searcher";
import { ProductSearcher } from "../../product/logic/product.searcher";
import { CartSearcher } from "../logic/cart.searcher";
import { CartBodyDto } from "../dto/cart-body.dto";

@Injectable()
export class CartUpdateService {
  constructor(
    private readonly cartUpdateRepository: CartUpdateRepository,
    private readonly cartSearcher: CartSearcher,
    private readonly userSearcher: UserSearcher,
    private readonly productSearcher: ProductSearcher,
  ) {}

  // General
  public async createCart(
    productId: string,
    clientUserId: string,
    cartBodyDto: CartBodyDto,
  ): Promise<void> {
    const { quantity, deliveryOption } = cartBodyDto;
    await this.cartSearcher.validateProduct(productId);

    const [clientUser, product] = await Promise.all([
      this.userSearcher.findClientUserObjectWithId(clientUserId),
      this.productSearcher.findProductWithId(productId),
    ]);

    const totalPrice = product.price * cartBodyDto.quantity;
    await this.cartUpdateRepository.createCart({
      product,
      clientUser,
      quantity,
      totalPrice,
      deliveryOption,
    });
  }
}
