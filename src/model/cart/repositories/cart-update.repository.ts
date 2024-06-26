import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CartEntity } from "../entities/cart.entity";
import { Repository } from "typeorm";
import { CreateCartDto } from "../dto/create-cart.dto";
import { ModifyCartDto } from "../dto/modify-cart.dto";
import { General } from "../../../common/decorators/general.decoration";

@Injectable()
export class CartUpdateRepository {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
  ) {}

  @General
  public async createCart(createCartDto: CreateCartDto): Promise<void> {
    const { product, clientUser, cartBodyDto } = createCartDto;
    await this.cartRepository.save({
      Product: product,
      ClientUser: clientUser,
      ...cartBodyDto,
    });
  }

  @General
  public async modifyCartWithId(modifyCartDto: ModifyCartDto): Promise<void> {
    const { cartId, cartBodyDto } = modifyCartDto;
    await this.cartRepository.update(cartId, cartBodyDto);
  }

  @General
  public async deleteAllCartsWithUserId(id: string): Promise<void> {
    await this.cartRepository
      .createQueryBuilder()
      .delete()
      .where("clientId = :id", { id })
      .execute();
  }

  @General
  public async deleteCartWithId(id: string): Promise<void> {
    await this.cartRepository.delete({ id });
  }
}
