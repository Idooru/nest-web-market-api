import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CartEntity } from "../entities/cart.entity";
import { Repository } from "typeorm";

@Injectable()
export class CartValidateRepository {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
  ) {}

  public async isExistId(id: string): Promise<boolean> {
    return await this.cartRepository.exist({ where: { id } });
  }
}
