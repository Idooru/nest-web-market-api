import { NotFoundException } from "@nestjs/common";
import { EntityErrorHandler } from "src/common/classes/abstract/entity-error-handler";
import { TypeOrmException } from "src/common/errors/typeorm.exception";
import { Throwable } from "src/common/lib/error-handler/interface/throwable.interface";
import { TypeORMError } from "typeorm";

export class ReviewVideoErrorHandler
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
    this.throwException(error);
  }

  private notFound(error: TypeORMError): void {
    const urlStuff = this.stuffArr.find((val) => val.key() === "url");

    if (
      error.message.includes("Could not find any entity of type") &&
      urlStuff
    ) {
      throw new NotFoundException(
        `해당 url(${urlStuff.value()})을 가진 리뷰 동영상을 찾을 수 없습니다. 검증 API를 먼저 사용해주세요.`,
      );
    }
  }

  public throwException(error: Error): never {
    throw new TypeOrmException(error);
  }
}
