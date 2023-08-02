import { NotFoundException } from "@nestjs/common";
import { EntityErrorHandler } from "src/common/classes/abstract/entity-error-handler";
import { Throwable } from "src/common/lib/error-handler/interface/throwable.interface";
import { TypeORMError } from "typeorm";

export class ProductImageErrorHandler
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

  private urlStuff = this.stuffArr.find((item) => item.key === "url");
  private emailStuff = this.stuffArr.find((item) => item.key === "email");

  public handle(error: TypeORMError): void {
    this.notFound(error);
    super.throwException(error);
  }

  private notFound(error: TypeORMError): void {
    if (this.urlStuff && this.emailStuff) {
      throw new NotFoundException(
        `해당 url(${this.urlStuff.value})과 업로더(${this.emailStuff.value})이 일치하지 않습니다.`,
      );
    }

    if (
      error.message.includes("Could not find any entity of type") &&
      this.idStuff
    ) {
      throw new NotFoundException(
        `해당 id(${this.idStuff.value})를 가진 상품 이미지를 찾을 수 없습니다.`,
      );
    }

    if (
      error.message.includes("Could not find any entity of type") &&
      this.urlStuff
    ) {
      throw new NotFoundException(
        `해당 url(${this.urlStuff.value})을 가진 상품 이미지를 찾을 수 없습니다. 검증 API를 먼저 사용해주세요.`,
      );
    }

    if (
      error.message.includes("Could not find any entity of type") &&
      this.emailStuff
    ) {
      throw new NotFoundException(
        `해당 업로더(${this.emailStuff.value})을 가진 상품 이미지를 찾을 수 없습니다. `,
      );
    }
  }
}
