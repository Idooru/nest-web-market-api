import { Injectable } from "@nestjs/common";
import { ValidateLibrary } from "../../../common/lib/util/validate.library";
import { ProductValidateRepository } from "../repositories/product-validate.repository";

@Injectable()
export class ProductValidator {
  constructor(
    private readonly productValidateRepository: ProductValidateRepository,
    private readonly validateLibrary: ValidateLibrary,
  ) {}

  async isExistId(id: string): Promise<void> {
    const result = await this.productValidateRepository.isExistId(id);
    this.validateLibrary.isExistData(result, "id", id);
  }

  async isNoneExistName(name: string): Promise<void> {
    const result = await this.productValidateRepository.isNoneExistName(name);
    this.validateLibrary.isNoneExistData(result, "name", name);
  }
}
