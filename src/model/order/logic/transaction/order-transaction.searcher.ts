import { ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { loggerFactory } from "../../../../common/functions/logger.factory";
import { UserSearcher } from "../../../user/logic/user.searcher";
import { CartSearcher } from "../../../cart/logic/cart.searcher";
import { AccountSearcher } from "../../../account/logic/account.searcher";
import { ClientUserEntity } from "../../../user/entities/client-user.entity";
import { AccountEntity } from "../../../account/entities/account.entity";
import { UserEntity } from "../../../user/entities/user.entity";
import { CartEntity } from "../../../cart/entities/cart.entity";
import { ProductEntity } from "../../../product/entities/product.entity";
import { SearchCreateOrderDto } from "../../dto/request/search-create-order.dto";
import { CreateOrderDto } from "../../dto/request/create-order.dto";
import { DeliveryOption } from "../../types/delivery-option.type";

class EntityFinder {
  constructor(
    private readonly userIdFilter: string,
    private readonly userSearcher: UserSearcher,
    private readonly accountSearcher: AccountSearcher,
    private readonly cartSearcher: CartSearcher,
  ) {}

  public findUser(userId: string): Promise<UserEntity> {
    return this.userSearcher.findEntity({
      property: this.userIdFilter,
      alias: { id: userId },
      getOne: true,
      entities: [AccountEntity, ClientUserEntity],
    }) as Promise<UserEntity>;
  }

  public findAccounts(userId: string): Promise<AccountEntity[]> {
    return this.accountSearcher.findEntity({
      property: "account.userId = :id",
      alias: { id: userId },
      getOne: false,
    }) as Promise<AccountEntity[]>;
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
export class OrderTransactionSearcher {
  private readonly entityFinder: EntityFinder;

  constructor(
    @Inject("user-id-filter")
    private readonly userIdFilter: string,
    @Inject("surtax-price")
    private readonly surtaxPrice: number,
    private readonly userSearcher: UserSearcher,
    private readonly accountSearcher: AccountSearcher,
    private readonly cartSearcher: CartSearcher,
  ) {
    this.entityFinder = new EntityFinder(this.userIdFilter, this.userSearcher, this.accountSearcher, this.cartSearcher);
  }

  private validateSurtax(deliveryOption: DeliveryOption) {
    // 배달 옵션에서 선택한 값이 "speed" 혹은 "safe"라면 부가세 여부가 참으로 설정
    return deliveryOption == "speed" || deliveryOption == "safe";
  }

  public async searchCreateOrder(dto: CreateOrderDto): Promise<SearchCreateOrderDto> {
    const { clientId, body } = dto;
    const [user, carts] = await Promise.all([
      this.entityFinder.findUser(clientId),
      this.entityFinder.findCarts(clientId),
    ]);

    const hasSurtax = this.validateSurtax(body.deliveryOption);

    if (!user.Account.length) {
      const message = "해당 사용자의 계좌가 존재하지 않습니다.";
      loggerFactory("None Account").error(message);
      throw new NotFoundException(message);
    }

    if (!carts.length) {
      const message = "장바구니에 상품이 존재하지 않습니다.";
      loggerFactory("None Product").error(message);
      throw new NotFoundException(message);
    }

    const accounts = await this.entityFinder.findAccounts(clientId);
    const mainAccount = accounts.find((account) => account.isMainAccount);
    const totalPrice = carts.map((cart) => cart.totalPrice).reduce((acc, cur) => acc + cur, 0);

    // 부가세 여부가 있다면 주 사용 계좌의 잔액이 총액과 부가새액을 합한 금액 만큼 있는지 확인
    const isFulfilledPurchase = hasSurtax
      ? mainAccount.balance >= totalPrice + this.surtaxPrice
      : mainAccount.balance >= totalPrice;

    if (!isFulfilledPurchase) {
      const message = "해당 사용자의 계좌에 상품의 총 액수만큼 금액이 존재하지 않습니다.";
      loggerFactory("underflow balance").error(message);
      throw new ForbiddenException(message);
    }

    const productQuantities = carts.map((cart) => ({
      product: cart.Product,
      quantity: cart.quantity,
    }));

    return {
      clientId,
      body,
      totalPrice,
      clientUser: user.ClientUser,
      productQuantities,
      account: mainAccount,
      hasSurtax,
    };
  }
}
