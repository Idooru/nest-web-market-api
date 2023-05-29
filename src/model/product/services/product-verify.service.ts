import { HttpStatus, Injectable } from "@nestjs/common";
import { ProductVerifyRepository } from "../repositories/product-verify.repository";
import { IProductVerifyService } from "../interfaces/services/product-verify-service.interface";
import { ErrorHandlerProps } from "src/common/classes/abstract/error-handler-props";
import { HttpExceptionHandlingBuilder } from "src/common/lib/error-handler/http-exception-handling.builder";

@Injectable()
export class ProductVerifyService
  extends ErrorHandlerProps
  implements IProductVerifyService
{
  constructor(
    private readonly productVerifyRepository: ProductVerifyRepository,
    private readonly httpExceptionHandlingBuilder: HttpExceptionHandlingBuilder,
  ) {
    super();
  }

  async isExistProductId(id: string): Promise<void> {
    const result = await this.productVerifyRepository.isExistProductId(id);

    if (!result) {
      this.methodName = this.isExistProductId.name;
      this.httpExceptionHandlingBuilder
        .setMessage("해당 상품 아이디는 데이터베이스에 존재하지 않습니다.")
        .setOccuredLocation("class")
        .setOccuredClass(this.className, this.methodName)
        .setExceptionStatus(HttpStatus.BAD_REQUEST)
        .handle();
    }
  }

  async isNotExistProductName(name: string): Promise<void> {
    const result = await this.productVerifyRepository.isNotExistProductName(
      name,
    );

    if (!result) {
      this.methodName = this.isNotExistProductName.name;
      this.httpExceptionHandlingBuilder
        .setMessage("해당 상품 이름은 데이터베이스에 존재합니다.")
        .setOccuredLocation("class")
        .setOccuredClass(this.className, this.methodName)
        .setExceptionStatus(HttpStatus.BAD_REQUEST)
        .handle();
    }
  }
}
