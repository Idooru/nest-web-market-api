import { BadRequestException, NotFoundException } from "@nestjs/common";
import { EntityErrorHandler } from "src/common/classes/abstract/entity-error-handler";
import { Throwable } from "src/common/lib/error-handler/interface/throwable.interface";
import { TypeORMError } from "typeorm";

export class ProductErrorHandler
  extends EntityErrorHandler
  implements Throwable
{
  constructor(
    protected error: TypeORMError,
    protected stuffs: string[],
    protected stuffMeans: string[],
  ) {
    super(stuffs, stuffMeans);
    this.handle(error);
  }

  private nameStuff = this.stuffArr.find((item) => item.key === "name");
  private priceStuff = this.stuffArr.find((item) => item.key === "price");
  private quantityStuff = this.stuffArr.find((item) => item.key === "quantity");

  public handle(error: TypeORMError): void {
    this.notFound(error);
    this.badRequest(error);
    super.throwException(error);
  }

  private notFound(error: TypeORMError): void {
    if (
      error.message.includes("Could not find any entity of type") &&
      this.idStuff
    ) {
      throw new NotFoundException(
        `해당 아이디(${this.idStuff.value})의 상품을 찾을 수 없습니다. 검증 API를 먼저 사용해주세요.`,
      );
    }

    if (
      error.message.includes("Could not find any entity of type") &&
      this.nameStuff
    ) {
      throw new NotFoundException(
        `해당 이름(${this.nameStuff.value})의 상품을 찾을 수 없습니다. 검증 API를 먼저 사용해주세요.`,
      );
    }
  }

  private badRequest(error: TypeORMError) {
    if (this.priceStuff && this.quantityStuff) {
      throw new BadRequestException(
        `가격혹은 수량을 마이너스(${this.priceStuff.value}, ${this.quantityStuff.value})로 수정 할 수 없습니다.`,
      );
    }

    if (
      error.message.includes("Out of range value for column") &&
      this.priceStuff
    ) {
      throw new BadRequestException(
        `가격을 마이너스(${this.priceStuff.value})로 수정 할 수 없습니다.`,
      );
    }

    if (
      error.message.includes("Out of range value for column") &&
      this.quantityStuff
    ) {
      throw new BadRequestException(
        `수량을 마이너스(${this.quantityStuff.value})로 수정 할 수 없습니다.`,
      );
    }
  }
}
