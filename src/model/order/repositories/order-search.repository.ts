import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderEntity } from "../entities/order.entity";
import { Repository, SelectQueryBuilder } from "typeorm";
import { OrderSelect } from "../../../common/config/repository-select-configs/order.select";
import {
  FindOptionalEntityArgs,
  FindPureEntityArgs,
  SearchRepository,
} from "../../../common/interfaces/search/search.repository";
import { Implemented } from "../../../common/decorators/implemented.decoration";
import { FindAllOrdersDto } from "../dto/request/find-all-orders.dto";
import { OrderBasicRawDto } from "../dto/response/order-basic-raw.dto";

@Injectable()
export class OrderSearchRepository extends SearchRepository<OrderEntity, FindAllOrdersDto, OrderBasicRawDto> {
  constructor(
    @Inject("order-select")
    private readonly select: OrderSelect,
    @Inject("surtax-price")
    private readonly surtaxPrice: number,
    @InjectRepository(OrderEntity)
    private readonly repository: Repository<OrderEntity>,
  ) {
    super();
  }

  private selectOrder(selects?: string[]): SelectQueryBuilder<OrderEntity> {
    const queryBuilder = this.repository.createQueryBuilder();
    if (selects && selects.length) {
      return queryBuilder.select(selects).from(OrderEntity, "order");
    }
    return queryBuilder.select("order").from(OrderEntity, "order");
  }

  @Implemented
  public findPureEntity(args: FindPureEntityArgs): Promise<OrderEntity | OrderEntity[]> {
    const { property, alias, getOne } = args;
    const query = this.selectOrder().where(property, alias);
    return super.getEntity(getOne, query);
  }

  @Implemented
  public findOptionalEntity(args: FindOptionalEntityArgs): Promise<OrderEntity | OrderEntity[]> {
    const { property, alias, entities, getOne } = args;
    const query = this.selectOrder().where(property, alias);
    super.joinEntity(entities, query, "order");
    return super.getEntity(getOne, query);
  }

  @Implemented
  public async findAllRaws(dto: FindAllOrdersDto): Promise<OrderBasicRawDto[]> {
    const { align, column, option, transactionStatus, userId } = dto;
    const query = this.selectOrder(this.select.order)
      .leftJoin("order.Payment", "Payment")
      .leftJoin("Payment.Product", "Product")
      .leftJoin("Product.ProductImage", "ProductImage")
      .orderBy(`order.${column}`, align)
      .where("order.clientId = :id", { id: userId });

    if (option) {
      query.andWhere("order.deliveryOption = :option", { option });
    }

    if (transactionStatus) {
      query.andWhere("order.transactionStatus = :transactionStatus", { transactionStatus });
    }

    const orders = await query.getMany();

    return orders.map((order) => ({
      order: {
        id: order.id,
        deliveryOption: order.deliveryOption,
        deliveryAddress: order.deliveryAddress,
        transactionStatus: order.transactionStatus,
        surtaxPrice: order.deliveryOption == "safe" || order.deliveryOption == "speed" ? this.surtaxPrice : 0,
        totalPrice: order.totalPrice,
      },
      payment: order.Payment.map((payment) => ({
        id: payment.id,
        quantity: payment.quantity,
        totalPrice: payment.totalPrice,
        product: {
          id: payment.Product.id,
          name: payment.Product.name,
          price: payment.Product.price,
          category: payment.Product.category,
        },
      })),
    }));
  }
}
