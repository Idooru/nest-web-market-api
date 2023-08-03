import { NotFoundException, BadRequestException } from "@nestjs/common";
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

  private emailStuff = this.stuffArr.find((item) => item.key === "email");
  private nickNameStuff = this.stuffArr.find((item) => item.key === "nickname");
  private realNameStuff = this.stuffArr.find((item) => item.key === "realname");
  private phoneNumberStuff = this.stuffArr.find(
    (item) => item.key === "phonenumber",
  );

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
        `해당 아이디(${this.idStuff.value})의 사용자를 찾을 수 없습니다. 검증 API를 먼저 사용해주세요.`,
      );
    }

    if (
      error.message.includes("Could not find any entity of type") &&
      this.emailStuff
    ) {
      throw new NotFoundException(
        `해당 이메일(${this.emailStuff.value})을 가진 사용자를 찾을 수 없습니다. 검증 API를 먼저 사용해주세요.`,
      );
    }

    if (
      error.message.includes("Could not find any entity of type") &&
      this.nickNameStuff
    ) {
      throw new NotFoundException(
        `해당 닉네임(${this.nickNameStuff.value})을 가진 사용자를 찾을 수 없습니다. 검증 API를 먼저 사용해주세요.`,
      );
    }

    if (
      (error.message.includes("Could not find any entity of type") &&
        this.realNameStuff) ||
      (error.message.includes("Could not find any entity of type") &&
        this.phoneNumberStuff)
    ) {
      throw new NotFoundException(
        "사용자 실명과 전화번호가 서로 일치하지 않습니다.",
      );
    }
  }
}
