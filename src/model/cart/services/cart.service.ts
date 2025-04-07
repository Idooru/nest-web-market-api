import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { CartUpdateRepository } from "../repositories/cart-update.repository";
import { UserSearcher } from "../../user/logic/user.searcher";
import { ProductSearcher } from "../../product/logic/product.searcher";
import { CartSearcher } from "../logic/cart.searcher";
import { loggerFactory } from "../../../common/functions/logger.factory";
import { General } from "../../../common/decorators/general.decoration";
import { ClientUserEntity } from "../../user/entities/client-user.entity";
import { UserEntity } from "../../user/entities/user.entity";
import { ProductEntity } from "../../product/entities/product.entity";
import { ValidateProductAmountDto } from "../dto/request/validate-product-amount.dto";
import { CreateCartDto, CreateCartRowDto } from "../dto/request/create-cart.dto";
import { ModifyCartDto } from "../dto/request/modify-cart.dto";
import { CartEntity } from "../entities/cart.entity";

class EntityFinder {
  constructor(
    private readonly userIdFilter: string,
    private readonly productIdFilter: string,
    private readonly userSearcher: UserSearcher,
    private readonly productSearcher: ProductSearcher,
    private readonly cartSearcher: CartSearcher,
  ) {}

  public findUser(clientUserId: string): Promise<UserEntity> {
    return this.userSearcher.findEntity({
      property: this.userIdFilter,
      alias: { id: clientUserId },
      getOne: true,
      entities: [ClientUserEntity],
    }) as Promise<UserEntity>;
  }

  public findProduct(productId: string): Promise<ProductEntity> {
    return this.productSearcher.findEntity({
      property: this.productIdFilter,
      alias: { id: productId },
      getOne: true,
    }) as Promise<ProductEntity>;
  }

  public findCarts(userId: string): Promise<CartEntity[]> {
    return this.cartSearcher.findEntity({
      property: "ClientUser.id = :id",
      alias: { id: userId },
      getOne: false,
      entities: [ClientUserEntity, ProductEntity],
    }) as Promise<CartEntity[]>;
  }
}

@Injectable()
export class CartService {
  private readonly entityFinder: EntityFinder;

  constructor(
    @Inject("user-id-filter")
    private readonly userIdFilter: string,
    @Inject("product-id-filter")
    private readonly productIdFilter: string,
    private readonly userSearcher: UserSearcher,
    private readonly productSearcher: ProductSearcher,
    private readonly cartUpdateRepository: CartUpdateRepository,
    private readonly cartSearcher: CartSearcher,
  ) {
    this.entityFinder = new EntityFinder(
      this.userIdFilter,
      this.productIdFilter,
      this.userSearcher,
      this.productSearcher,
      this.cartSearcher,
    );
  }

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
    const carts = await this.entityFinder.findCarts(clientUserId);
    const hasProduct = carts.find((cart) => cart.Product.id === productId);

    if (hasProduct) {
      const message =
        "한 사용자가 같은 상품을 중복해서 장바구니에 올릴 수 없습니다. 상품이 필요하시다면 수량을 늘려주세요.";
      loggerFactory("Alread Exist").error(message);
      throw new BadRequestException(message);
    }

    const [user, product] = await Promise.all([
      this.entityFinder.findUser(clientUserId),
      this.entityFinder.findProduct(productId),
    ]);

    const validateDto: ValidateProductAmountDto = { product, body };
    this.validateProductAmount(validateDto);

    const createDto: CreateCartRowDto = { body, clientUser: user.ClientUser, product };
    await this.cartUpdateRepository.createCartRow(createDto);
  }

  @General
  public async modifyCart(dto: ModifyCartDto): Promise<void> {
    const { productId, body } = dto;
    const product = await this.entityFinder.findProduct(productId);

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
