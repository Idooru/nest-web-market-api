import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CartEntity } from "../entities/cart.entity";
import { Repository } from "typeorm";
import { CartSelectProperty } from "../../../common/config/repository-select-configs/cart.select";
import { loggerFactory } from "../../../common/functions/logger.factory";

@Injectable()
export class CartSearchRepository {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
    @Inject("CartsSelectProperty")
    private readonly cartSelect: CartSelectProperty,
  ) {}

  public async findCartsWithId(id: string): Promise<CartEntity[]> {
    const carts = await this.cartRepository
      .createQueryBuilder()
      .select(this.cartSelect.carts)
      .from(CartEntity, "cart")
      .innerJoin("cart.product", "Product")
      .innerJoin("Product.Image", "Image")
      .where("cart.clientId = :id", { id })
      .getMany();

    if (!carts.length) {
      const message = "해당 사용자의 장바구니 목록을 찾을 수가 없습니다.";
      loggerFactory("None Exist").error(message);
      throw new NotFoundException(message);
    }

    return carts;
  }

  public async findProductOnCart(id: string): Promise<CartEntity> {
    return await this.cartRepository
      .createQueryBuilder()
      .select("cart.id")
      .from(CartEntity, "cart")
      .where("cart.productId = :id", { id })
      .getOne();
  }
}
