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
    private readonly productVerifyRepository: Repository<ProductEntity>,
  ) {}

  private readonly logger = new Logger("Repository");

  async isExistProductId(id: string): Promise<boolean> {
    try {
      const result = await this.productVerifyRepository.findOne({
        where: { id },
      });
      return result ? true : false;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async isNotExistProductName(name: string): Promise<boolean> {
    try {
      const result = await this.productVerifyRepository.findOne({
        where: { name },
      });
      return result ? false : true;
    } catch (err) {
      this.logger.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }
}
