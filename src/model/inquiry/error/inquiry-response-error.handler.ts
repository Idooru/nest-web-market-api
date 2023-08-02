import { NotFoundException } from "@nestjs/common";
import { EntityErrorHandler } from "src/common/classes/abstract/entity-error-handler";
import { Throwable } from "src/common/lib/error-handler/interface/throwable.interface";
import { TypeORMError } from "typeorm";

export class InquiryResponseErrorHandler
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

  public handle(error: TypeORMError): void {
    this.notFound(error);
    super.throwException(error);
  }

  private notFound(error: TypeORMError): void {
    if (
      error.message.includes("Could not find any entity of type") &&
      this.idStuff
    ) {
      throw new NotFoundException(
        `해당 id(${this.idStuff.value})을 가진 문의 응답을 찾을 수 없습니다.`,
      );
    }
  }
}
