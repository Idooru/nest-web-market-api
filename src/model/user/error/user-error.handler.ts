import { NotFoundException } from "@nestjs/common";
import { EntityErrorHandler } from "src/common/classes/abstract/entity-error-handler";
import { Throwable } from "src/common/lib/error-handler/interface/throwable.interface";
import { TypeORMError } from "typeorm";

export class UserErrorHandler extends EntityErrorHandler implements Throwable {
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
    const idStuff = this.stuffArr.find((val) => val.key() === "id");
    const emailStuff = this.stuffArr.find((val) => val.key() === "email");
    const nickNameStuff = this.stuffArr.find((val) => val.key() === "nickname");
    const realNameStuff = this.stuffArr.find((val) => val.key() === "realname");
    const phoneNumberStuff = this.stuffArr.find(
      (val) => val.key() === "phonenumber",
    );

    if (
      error.message.includes("Could not find any entity of type") &&
      idStuff
    ) {
      throw new NotFoundException(
        `해당 아이디(${idStuff.value()})의 사용자를 찾을 수 없습니다. 검증 API를 먼저 사용해주세요.`,
      );
    }

    if (
      error.message.includes("Could not find any entity of type") &&
      emailStuff
    ) {
      throw new NotFoundException(
        `해당 이메일(${emailStuff.value()})을 가진 사용자를 찾을 수 없습니다. 검증 API를 먼저 사용해주세요.`,
      );
    }

    if (
      error.message.includes("Could not find any entity of type") &&
      nickNameStuff
    ) {
      throw new NotFoundException(
        `해당 닉네임(${nickNameStuff.value()})을 가진 사용자를 찾을 수 없습니다. 검증 API를 먼저 사용해주세요.`,
      );
    }

    if (realNameStuff || phoneNumberStuff) {
      throw new NotFoundException(
        "사용자 실명과 전화번호가 서로 일치하지 않습니다.",
      );
    }
  }
}
