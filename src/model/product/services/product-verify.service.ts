import { Injectable } from "@nestjs/common";
import { BadRequestException } from "@nestjs/common/exceptions";
import { ProductVerifyRepository } from "../repositories/product-verify.repository";

@Injectable()
export class ProductVerifyService {
  constructor(
    private readonly productVerifyRepository: ProductVerifyRepository,
  ) {}

  async isExistProductId(id: string): Promise<void> {
    const result = await this.productVerifyRepository.isExistProductId(id);

    if (!result) {
      throw new BadRequestException(
        "해당 상품 아이디는 데이터베이스에 존재하지 않습니다.",
      );
    }
  }

  async isNotExistProductName(name: string): Promise<void> {
    const result = await this.productVerifyRepository.isNotExistProductName(
      name,
    );

    if (!result) {
      throw new BadRequestException(
        "해당 상품 이름은 데이터베이스에 존재합니다.",
      );
    }
  }
}
