import { NotFoundException } from "@nestjs/common";
import { EntityErrorHandler } from "src/common/classes/abstract/entity-error-handler";
import { TypeORMError } from "typeorm";

export class StarRateErrorCase extends EntityErrorHandler {
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
  }

  private notFound(error: TypeORMError): void {
    const idStuff = this.stuffArr.find((val) => val.key() === "id");

    if (
      error.message.includes("Could not find any entity of type") &&
      idStuff
    ) {
      throw new NotFoundException(
        `해당 아이디(${idStuff.value()})의 별점을 찾을 수 없습니다. 검증 API를 먼저 사용해주세요.`,
      );
    }
  }
}
