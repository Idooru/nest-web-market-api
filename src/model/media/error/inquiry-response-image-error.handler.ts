import { NotFoundException } from "@nestjs/common";
import { EntityErrorHandler } from "src/common/classes/abstract/entity-error-handler";
import { TypeORMError } from "typeorm";

export class InquiryResponseImageErrorHandler extends EntityErrorHandler {
  constructor(
    protected readonly error: TypeORMError,
    protected readonly stuffs: string[],
    protected readonly stuffMeans: string[],
  ) {
    super(stuffs, stuffMeans);
    this.handle(error);
  }

  private urlStuff = this.stuffArr.find((item) => item.key === "url");

  public handle(error: TypeORMError): void {
    this.notFound(error);
    super.throwException(error);
  }

  private notFound(error: TypeORMError): void {
    if (
      error.message.includes("Could not find any entity of type") &&
      this.urlStuff
    ) {
      throw new NotFoundException(
        `해당 url(${this.urlStuff.value})을 가진 문의 응답 이미지를 찾을 수 없습니다.`,
      );
    }
  }
}
