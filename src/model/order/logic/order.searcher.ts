import { Injectable } from "@nestjs/common";
import { OrderSearchRepository } from "../repositories/order-search.repository";
import { OrderEntity } from "../entities/order.entity";
import { FindEntityArgs, Searcher } from "../../../common/interfaces/search/searcher";
import { Implemented } from "../../../common/decorators/implemented.decoration";
import { FindAllOrdersDto } from "../dto/request/find-all-orders.dto";
import { OrderBasicRawDto } from "../dto/response/order-basic-raw.dto";

@Injectable()
export class OrderSearcher implements Searcher<OrderEntity, FindAllOrdersDto, OrderBasicRawDto> {
  constructor(private readonly orderSearchRepository: OrderSearchRepository) {}

  @Implemented
  public findEntity(args: FindEntityArgs): Promise<OrderEntity | OrderEntity[]> {
    const { property, alias, getOne, entities } = args;
    if (entities && entities.length) {
      return this.orderSearchRepository.findOptionalEntity({ property, alias, entities, getOne });
    }
    return this.orderSearchRepository.findPureEntity({ property, alias, getOne });
  }

  @Implemented
  public findAllRaws(dto: FindAllOrdersDto): Promise<OrderBasicRawDto[]> {
    return this.orderSearchRepository.findAllRaws(dto);
  }
}
