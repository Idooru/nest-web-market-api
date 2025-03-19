import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CartEntity } from "../entities/cart.entity";
import { Repository } from "typeorm";
import { CartSelect } from "../../../common/config/repository-select-configs/cart.select";

@Injectable()
export class CartSearchRepository {
  constructor(
    @Inject("cart-select")
    private readonly select: CartSelect,
    @InjectRepository(CartEntity)
    private readonly repository: Repository<CartEntity>,
  ) {}

  public findAllCarts(clientId: string): Promise<CartEntity[]> {
    return this.repository
      .createQueryBuilder()
      .select(this.select.carts)
      .from(CartEntity, "cart")
      .innerJoin("cart.Product", "Product")
      .innerJoin("Product.creator", "AdminUser")
      .leftJoin("Product.Image", "Image")
      .where("cart.clientId = :clientId", { clientId })
      .getMany();
  }

  public findProductOnCart(clientId: string, productId: string): Promise<CartEntity> {
    return this.repository
      .createQueryBuilder()
      .select("cart.id")
      .from(CartEntity, "cart")
      .where("cart.clientId = :clientId", { clientId })
      .andWhere("cart.productId = :productId", { productId })
      .getOne();
  }
}
