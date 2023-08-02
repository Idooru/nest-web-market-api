import { NotFoundException } from "@nestjs/common";
import { EntityErrorHandler } from "src/common/classes/abstract/entity-error-handler";
import { Throwable } from "src/common/lib/error-handler/interface/throwable.interface";
import { TypeORMError } from "typeorm";

export class ClientUserErrorHandler
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
        `해당 아이디(${this.idStuff.value})의 고객 사용자를 찾을 수 없습니다. 검증 API를 먼저 실행시켜주세요.`,
      );
    }
  }
}
