import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CartEntity } from "../entities/cart.entity";
import { Repository } from "typeorm";
import { CreateCartDto } from "../dto/create-cart.dto";
import { ModifyCartDto } from "../dto/modify-cart.dto";
import { PaymentRepositoryVo } from "../../payment/logic/transaction/payment-repository.vo";

@Injectable()
export class CartUpdateRepository {
  constructor(
    private readonly queryRunner: PaymentRepositoryVo,
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
  ) {}

  // Transaction
  public async deleteAllCartsOnTransaction(id: string): Promise<void> {
    await this.queryRunner.paymentRepository
      .createQueryBuilder()
      .delete()
      .where("clientId = :id", { id })
      .execute();
  }

  // General
  public async createCart(createCartDto: CreateCartDto): Promise<void> {
    const { product, clientUser, cartBodyDto } = createCartDto;
    await this.cartRepository.save({
      Product: product,
      ClientUser: clientUser,
      ...cartBodyDto,
    });
  }

  public async modifyCartWithId(modifyCartDto: ModifyCartDto): Promise<void> {
    const { id, cartBodyDto } = modifyCartDto;
    await this.cartRepository.update(id, cartBodyDto);
  }

  public async deleteAllCartsWithUserId(id: string): Promise<void> {
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
