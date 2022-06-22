import { ModifyProductDto } from "./dto/modify_product.dto";
import { CreateProductDto } from "./dto/create_product.dto";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductEntity } from "./product.entity";

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async checkProductNameToCreate(name: string): Promise<void> {
    const found = await this.productRepository.findOne({
      select: ["name"],
      where: { name },
    });

    if (!found) {
      return;
    } else if (found.name) {
      throw new BadRequestException("해당 상품명은 사용중입니다.");
    }
  }

  async checkProductNameToModify(replaceName: string, originalName: string) {
    const found = await this.productRepository.findOne({
      select: ["name"],
      where: { name: replaceName },
    });

    /* 바꿀 이름으로 찾은게 없거나 바꿔야 할 상품의 이름과 바꿀 이름이 동일 하다면 리턴함
      그 이외의 경우는 DB에 저장된 상품의 이름으로 바꾸게 되는 경우 이므로 에러를 던짐*/
    if (!found || found.name === originalName) {
      return;
    } else throw new BadRequestException("해당 상품명은 사용중입니다.");
  }

  async checkProductIdToExist(id: string) {
    const found = await this.productRepository.findOne({ where: id });

    if (!found) {
      throw new BadRequestException("해당 상품 아이디는 존재하지 않습니다.");
    }
  }

  async findProductsAllFromLatest(): Promise<ProductEntity[]> {
    const found = await this.productRepository.find({
      order: { createdAt: "DESC" },
      relations: ["image"],
    });
    if (!found) {
      throw new NotFoundException("데이터베이스에 상품이 존재하지 않습니다.");
    }
    return found;
  }

  async findProductsAllFromOldest(): Promise<ProductEntity[]> {
    const found = await this.productRepository.find({
      order: { createdAt: "ASC" },
      relations: ["image"],
    });

    if (!found) {
      throw new NotFoundException("데이터베이스에 상품이 존재하지 않습니다.");
    }
    return found;
  }

  async findProductOneByName(name: string): Promise<ProductEntity> {
    try {
      return await this.productRepository.findOneOrFail({
        where: { name },
        relations: ["image"],
      });
    } catch (err) {
      throw new NotFoundException("해당 상품이름은 존재하지 않습니다.");
    }
  }

  async findProductOneById(id: string): Promise<ProductEntity> {
    try {
      return await this.productRepository.findOneOrFail({
        where: { id },
        relations: ["image"],
      });
    } catch (err) {
      throw new NotFoundException("해당 상품 아이디는 존재하지 않습니다.");
    }
  }

  async createProduct(createProductDto: CreateProductDto): Promise<void> {
    await this.productRepository.save({ ...createProductDto });
  }

  async modifyProduct(
    id: string,
    modifyProductDto: ModifyProductDto,
  ): Promise<void> {
    await this.productRepository.update(id, { ...modifyProductDto });
  }

  async removeProduct(id: string): Promise<void> {
    await this.productRepository.delete(id);
  }
}
