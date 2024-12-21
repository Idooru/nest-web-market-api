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

  public async findCartsWithUserId(clientId: string): Promise<CartEntity[]> {
    const carts = await this.cartRepository
      .createQueryBuilder()
      .select(this.cartSelect.carts)
      .from(CartEntity, "cart")
      .innerJoin("cart.Product", "Product")
      .innerJoin("Product.Image", "Image")
      .innerJoin("Product.creator", "Admin")
      .innerJoin("Admin.User", "User")
      .innerJoin("User.Account", "Account")
      .where("cart.clientId = :clientId", { clientId })
      .getMany();

    if (!carts.length) {
      const message = "해당 사용자의 장바구니 목록을 찾을 수가 없습니다.";
      loggerFactory("None Exist").error(message);
      throw new NotFoundException(message);
    }

    return carts;
  }

  public findProductOnCart(clientId: string, productId: string): Promise<CartEntity> {
    return this.cartRepository
      .createQueryBuilder()
      .select("cart.id")
      .from(CartEntity, "cart")
      .where("cart.clientId = :clientId", { clientId })
      .andWhere("cart.productId = :productId", { productId })
      .getOne();
  }
}
