import { Injectable } from "@nestjs/common";
import { CartUpdateRepository } from "../repositories/cart-update.repository";
import { UserSearcher } from "../../user/logic/user.searcher";
import { ProductSearcher } from "../../product/logic/product.searcher";
import { CartSearcher } from "../logic/cart.searcher";
import { CartBodyDto } from "../dto/cart-body.dto";
import { ModifyCartDto } from "../dto/modify-cart.dto";

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
    await this.cartSearcher.validateProduct(productId);

    const [clientUser, product] = await Promise.all([
      this.userSearcher.findClientUserObjectWithId(clientUserId),
      this.productSearcher.findProductWithId(productId),
    ]);

    await this.cartUpdateRepository.createCart({
      product,
      clientUser,
      cartBodyDto,
    });
  }

  public async modifyCartWithId(modifyCartDto: ModifyCartDto): Promise<void> {
    await this.cartUpdateRepository.modifyCartWithId(modifyCartDto);
  }

  public async deleteCartWithId(id: string): Promise<void> {
    await this.cartUpdateRepository.deleteCartWithId(id);
  }
}
