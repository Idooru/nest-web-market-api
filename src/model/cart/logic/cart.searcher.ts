import { Injectable } from "@nestjs/common";
import { CartSearchRepository } from "../repositories/cart-search.repository";
import { FindEntityArgs, Searcher } from "../../../common/interfaces/search/searcher";
import { CartEntity } from "../entities/cart.entity";
import { Implemented } from "../../../common/decorators/implemented.decoration";
import { FindAllCartsDto } from "../dto/request/find-all-carts.dto";
import { CartsBasicRawDto } from "../dto/response/carts-basic-raw.dto";

@Injectable()
export class CartSearcher implements Searcher<CartEntity, FindAllCartsDto, CartsBasicRawDto> {
  constructor(private readonly cartSearchRepository: CartSearchRepository) {}

  @Implemented
  public findEntity(args: FindEntityArgs): Promise<CartEntity | CartEntity[]> {
    const { property, alias, getOne, entities } = args;
    if (entities && entities.length) {
      return this.cartSearchRepository.findOptionalEntity({ property, alias, entities, getOne });
    }
    return this.cartSearchRepository.findPureEntity({ property, alias, getOne });
  }

  @Implemented
  public async findAllRaws(dto: FindAllCartsDto): Promise<CartsBasicRawDto[]> {
    return this.cartSearchRepository.findAllRaws(dto);
  }
}
