import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CartEntity } from "../entities/cart.entity";
import { Repository } from "typeorm";
import { CreateCartDto } from "../dto/create-cart.dto";
import { ModifyCartDto } from "../dto/modify-cart.dto";

@Injectable()
export class CartUpdateRepository {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
  ) {}

  // General
  public async createCart(createCartDto: CreateCartDto): Promise<CartEntity> {
    const { product, clientUser, cartBodyDto } = createCartDto;
    return await this.cartRepository.save({
      product,
      clientUser,
      ...cartBodyDto,
    });
  }

  public async modifyCartWithId(modifyCartDto: ModifyCartDto): Promise<void> {
    const { id, cartBodyDto } = modifyCartDto;
    await this.cartRepository.update(id, cartBodyDto);
  }

  public async deleteAllCartWithUserId(id: string): Promise<void> {
    await this.cartRepository
      .createQueryBuilder()
      .delete()
      .where("clientId = :id", { id })
      .execute();
  }

  public async deleteCartWithId(id: string): Promise<void> {
    await this.cartRepository.delete({ id });
  }
}
