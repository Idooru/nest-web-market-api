import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CartEntity } from "../entities/cart.entity";
import { Repository } from "typeorm";
import { CreateCartDto } from "../dto/create-cart.dto";

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
}
