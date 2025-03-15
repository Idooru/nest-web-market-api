import { BadRequestException, Injectable } from "@nestjs/common";
import { CartUpdateRepository } from "../repositories/cart-update.repository";
import { UserSearcher } from "../../user/logic/user.searcher";
import { ProductSearcher } from "../../product/logic/product.searcher";
import { CartSearcher } from "../logic/cart.searcher";
import { ModifyCartDto } from "../dto/modify-cart.dto";
import { loggerFactory } from "../../../common/functions/logger.factory";
import { General } from "../../../common/decorators/general.decoration";
import { CreateCartDto, CreateCartRowDto } from "../dto/create-cart.dto";
import { ValidateProductAmountDto } from "../dto/validate-product-amount.dto";

@Injectable()
export class CartService {
  constructor(
    private readonly cartUpdateRepository: CartUpdateRepository,
    private readonly cartSearcher: CartSearcher,
    private readonly userSearcher: UserSearcher,
    private readonly productSearcher: ProductSearcher,
  ) {}

  private validateProductAmount(dto: ValidateProductAmountDto): void {
    const { product, body } = dto;
    const { quantity, totalPrice } = body;

    if (product.price * quantity !== totalPrice) {
      const message = `상품의 총 가격이 가격과 수량의 곱과 같지 않습니다.`;
      loggerFactory("Not Same").error(message);
      throw new BadRequestException(message);
    }

    // if (product.quantities <= 0 || product.quantities - quantities < 0) {
    //   const message = "해당 상품의 수량이 부족합니다.";
    //   loggerFactory("Empty Stock").error(message);
    //   throw new ForbiddenException(message);
    // }
  }

  @General
  public async createCart(dto: CreateCartDto): Promise<void> {
    const { productId, clientUserId, body } = dto;
    await this.cartSearcher.validateProduct(clientUserId, productId);

    const [clientUser, product] = await Promise.all([
      this.userSearcher.findClientUserObjectWithId(clientUserId),
      this.productSearcher.findProductWithId(productId),
    ]);

    const validateDto: ValidateProductAmountDto = { product, body };
    this.validateProductAmount(validateDto);

    const createDto: CreateCartRowDto = { body, clientUser, product };
    await this.cartUpdateRepository.createCartRow(createDto);
  }

  @General
  public async modifyCart(dto: ModifyCartDto): Promise<void> {
    const { productId, body } = dto;
    const product = await this.productSearcher.findProductWithId(productId);

    const validateDto: ValidateProductAmountDto = { product, body };
    this.validateProductAmount(validateDto);

    await this.cartUpdateRepository.modifyCart(dto);
  }

  @General
  public async deleteAllCarts(id: string): Promise<void> {
    await this.cartUpdateRepository.deleteAllCarts(id);
  }

  @General
  public async deleteCart(id: string): Promise<void> {
    await this.cartUpdateRepository.deleteCart(id);
  }
}
