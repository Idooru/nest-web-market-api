import { Injectable, PipeTransform } from "@nestjs/common";
import { ProductValidator } from "../../logic/product.validator";
import { Implemented } from "src/common/decorators/implemented.decoration";
import { ProductCategory } from "../../types/product-category.type";

type DTO = {
  name: string;
  price: number;
  origin: string;
  category: ProductCategory;
  description: string;
  stock: number;
};

@Injectable()
export class OperateProductValidationPipe<T extends DTO> implements PipeTransform {
  constructor(private readonly validator: ProductValidator) {}

  @Implemented
  public async transform(dto: T): Promise<T> {
    await this.validator.isNoneExistName(dto.name);
    return dto;
  }
}
