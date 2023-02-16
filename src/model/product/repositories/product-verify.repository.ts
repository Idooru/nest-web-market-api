import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductEntity } from "../entities/product.entity";

@Injectable()
export class ProductVerifyRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  private readonly logger = new Logger("Error");

  async isExistProductId(id: string): Promise<boolean> {
    try {
      const result = await this.productRepository.findOne({ where: { id } });
      return result ? true : false;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async isNotExistProductName(name: string): Promise<boolean> {
    try {
      const result = await this.productRepository.findOne({ where: { name } });
      return result ? false : true;
    } catch (err) {
      this.logger.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }
}
