import { BadRequestException, NotFoundException } from "@nestjs/common";
import { EntityErrorHandler } from "src/common/classes/abstract/entity-error-handler";
import { TypeORMError } from "typeorm";

export class ProductErrorCase extends EntityErrorHandler {
  constructor(
    protected error: TypeORMError,
    protected stuffs: string[],
    protected stuffMeans: string[],
  ) {
    super(stuffs, stuffMeans);
    this.handle(error);
  }

  public handle(error: TypeORMError): void {
    this.notFound(error);
    this.badRequest(error);
  }

  private notFound(error: TypeORMError): void {
    const idStuff = this.stuffArr.find((val) => val.key() === "id");
    const nameStuff = this.stuffArr.find((val) => val.key() === "name");

    if (
      error.message.includes("Could not find any entity of type") &&
      nameStuff
    ) {
      throw new NotFoundException(
        `해당 이름(${nameStuff.value()})의 상품을 찾을 수 없습니다. 검증 API를 먼저 사용해주세요.`,
      );
    }

    if (
      error.message.includes("Could not find any entity of type") &&
      idStuff
    ) {
      throw new NotFoundException(
        `해당 아이디(${idStuff.value()})의 상품을 찾을 수 없습니다. 검증 API를 먼저 사용해주세요.`,
      );
    }
  }

  private badRequest(error: TypeORMError) {
    const priceStuff = this.stuffArr.find((val) => val.key() === "price");

    const quantityStuff = this.stuffArr.find((val) => val.key() === "quantity");

    if (priceStuff && quantityStuff) {
      throw new BadRequestException(
        `가격혹은 수량을 마이너스(${priceStuff.value()}, ${quantityStuff.value()})로 수정 할 수 없습니다.`,
      );
    }

    if (error.message.includes("Out of range value for column") && priceStuff) {
      throw new BadRequestException(
        `가격을 마이너스(${priceStuff.value()})로 수정 할 수 없습니다.`,
      );
    }

    if (
      error.message.includes("Out of range value for column") &&
      quantityStuff
    ) {
      throw new BadRequestException(
        `수량을 마이너스(${quantityStuff.value()})로 수정 할 수 없습니다.`,
      );
    }
  }
}
