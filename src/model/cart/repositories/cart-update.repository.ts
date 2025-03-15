import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CartEntity } from "../entities/cart.entity";
import { Repository } from "typeorm";
import { CreateCartRowDto } from "../dto/create-cart.dto";
import { ModifyCartDto } from "../dto/modify-cart.dto";
import { General } from "../../../common/decorators/general.decoration";

@Injectable()
export class CartUpdateRepository {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
  ) {}

  @General
  public async createCartRow(dto: CreateCartRowDto): Promise<void> {
    const { product, clientUser, body } = dto;
    await this.cartRepository.save({
      Product: product,
      ClientUser: clientUser,
      ...body,
    });
  }

  @General
  public async modifyCart(modifyCartDto: ModifyCartDto): Promise<void> {
    const { cartId, body } = modifyCartDto;
    await this.cartRepository.update(cartId, body);
  }

  @General
  public async deleteAllCarts(id: string): Promise<void> {
    await this.cartRepository.createQueryBuilder().delete().where("clientId = :id", { id }).execute();
  }

  @General
  public async deleteCart(id: string): Promise<void> {
    await this.cartRepository.delete({ id });
  }
}
