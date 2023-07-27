import { NotFoundException } from "@nestjs/common";
import { EntityErrorHandler } from "src/common/classes/abstract/entity-error-handler";
import { Throwable } from "src/common/lib/error-handler/interface/throwable.interface";
import { TypeORMError } from "typeorm";

export class InquiryRequestImageErrorHandler
  extends EntityErrorHandler
  implements Throwable
{
  constructor(
    protected readonly error: TypeORMError,
    protected readonly stuffs: string[],
    protected readonly stuffMeans: string[],
  ) {
    super(stuffs, stuffMeans);
    this.handle(error);
  }

  public handle(error: TypeORMError) {
    this.notFound(error);
    super.throwException(error);
  }

  private notFound(error: TypeORMError): void {
    const urlStuff = this.stuffArr.find((val) => val.key() === "url");

    if (
      error.message.includes("Could not find any entity of type") &&
      urlStuff
    ) {
      throw new NotFoundException(
        `해당 url(${urlStuff.value()})을 가진 문의 요청 이미지를 찾을 수 없습니다. 검증 API를 먼저 사용해주세요.`,
      );
    }
  }
}
