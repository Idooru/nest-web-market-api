import { Inject, Injectable } from "@nestjs/common";
import { OrderUpdateRepository } from "../repositories/order-update.repository";
import { OrderEntity } from "../entities/order.entity";
import { Transaction } from "../../../common/decorators/transaction.decorator";
import { ProductQuantity } from "../types/product-quantity.type";
import { AccountSearcher } from "../../account/logic/account.searcher";
import { AccountEntity } from "../../account/entities/account.entity";
import { ProductSearcher } from "../../product/logic/product.searcher";
import { ProductEntity } from "../../product/entities/product.entity";
import { AdminUserEntity } from "../../user/entities/admin-user.entity";
import { CreateOrderRowDto } from "../dto/request/create-order.dto";
import { CreatePaymentsDto } from "../dto/request/create-payments.dto";
import { CreatePaymentDto } from "../dto/request/create-payment.dto";
import { WithdrawClientBalanceDto } from "../dto/request/withdraw-client-balance.dto";
import { DepositAdminBalanceDto, DepositAdminBalanceRowDto } from "../dto/request/deposit-admin-balance.dto";

class EntityFinder {
  constructor(
    private readonly productIdFilter: string,
    private readonly accountSearcher: AccountSearcher,
    private readonly productSearcher: ProductSearcher,
  ) {}

  public findAccounts(userId: string): Promise<AccountEntity[]> {
    return this.accountSearcher.findEntity({
      property: "account.userId = :id",
      alias: { id: userId },
      getOne: false,
    }) as Promise<AccountEntity[]>;
  }

  public findProduct(productId: string): Promise<ProductEntity> {
    return this.productSearcher.findEntity({
      property: this.productIdFilter,
      alias: { id: productId },
      getOne: true,
      entities: [AdminUserEntity],
    }) as Promise<ProductEntity>;
  }
}

@Injectable()
export class OrderService {
  private readonly entityFinder: EntityFinder;

  constructor(
    @Inject("product-id-filter")
    private readonly productIdFilter: string,
    private readonly accountSearcher: AccountSearcher,
    private readonly productSearcher: ProductSearcher,
    private readonly orderUpdateRepository: OrderUpdateRepository,
  ) {
    this.entityFinder = new EntityFinder(this.productIdFilter, this.accountSearcher, this.productSearcher);
  }

  @Transaction
  public async deleteAllCarts(id: string) {
    await this.orderUpdateRepository.deleteAllCartsOnTransaction(id);
  }

  @Transaction
  public async decreaseProductStocks(productQuantities: Array<ProductQuantity>): Promise<void> {
    const decreasing = productQuantities.map((productQuantity: ProductQuantity) =>
      this.orderUpdateRepository.decreaseProductStock(productQuantity),
    );

    await Promise.all(decreasing);
  }

  @Transaction
  public createOrder(dto: CreateOrderRowDto): Promise<OrderEntity> {
    return this.orderUpdateRepository.createOrderRow(dto);
  }

  @Transaction
  public async createPayments(dto: CreatePaymentsDto): Promise<void> {
    const { productQuantities, clientUser, order } = dto;
    const creating = productQuantities.map((productQuantity) => {
      const createPaymentDto: CreatePaymentDto = {
        productQuantity,
        clientUser,
        order,
      };
      this.orderUpdateRepository.createPayment(createPaymentDto);
    });

    await Promise.all(creating);
  }

  @Transaction
  public async withdrawClientBalance(dto: WithdrawClientBalanceDto): Promise<void> {
    await this.orderUpdateRepository.withdrawClientBalance(dto);
  }

  @Transaction
  public async depositAdminBalance(dto: DepositAdminBalanceDto): Promise<void> {
    const { productQuantities, hasSurtax } = dto;

    const balances = await Promise.all(
      productQuantities.map(async (productQuantity) => {
        const { product } = productQuantity;

        // 상품 아이디로 상품을 생성한 관리자 계정의 아이디를 구함
        const found = await this.entityFinder.findProduct(product.id);
        const userId = found.AdminUser.id;

        // 관리자 계정의 아이디로 계정들을 찾은 후 그 중 메인 계정의 잔액을 찾음
        const accounts = await this.entityFinder.findAccounts(userId);
        const mainAccount = accounts.find((account) => account.isMainAccount);
        const balance = mainAccount.balance;

        return { userId, balance };
      }),
    );

    const totalPrices = await Promise.all(
      productQuantities.map(async (productQuantity) => {
        const { product, quantity } = productQuantity;

        // 상품 아이디로 상품을 생성한 관리자 계정의 아이디를 구함
        const found = await this.entityFinder.findProduct(product.id);
        const userId = found.AdminUser.id;

        // 상품의 가격과 수량을 곱하여 총 금액을 구함
        const totalPrice = product.price * quantity;

        return { userId, totalPrice };
      }),
    );

    //
    const map = new Map<string, DepositAdminBalanceRowDto>();
    balances.forEach(({ userId, balance }) => map.set(userId, { userId, balance, totalPrice: 0, hasSurtax }));

    totalPrices.forEach(({ userId, totalPrice }) =>
      map.has(userId)
        ? (map.get(userId).totalPrice += totalPrice)
        : map.set(userId, { userId, balance: 0, totalPrice, hasSurtax }),
    );

    const groups = Array.from(map.values());

    // const groups = [...balances, ...totalPrices].reduce((result, item) => {
    //   const key = item.userId;
    //
    //   if (!result[key]) {
    //     result[key] = {};
    //   }
    //
    //   Object.assign(result[key], item);
    //
    //   return result;
    // }, {});

    const depositing = Object.values(groups).map((group: DepositAdminBalanceRowDto) =>
      this.orderUpdateRepository.depositAdminBalance(group),
    );

    await Promise.all(depositing);
  }
}
