import { NotFoundException } from "@nestjs/common";
import { ErrorCaseProp } from "src/common/classes/error-case-prop";

export class UserErrorCase extends ErrorCaseProp {
  constructor(
    protected readonly error: Error,
    protected readonly stuffs: string[],
    protected readonly stuffMeans: string[],
  ) {
    super(stuffs, stuffMeans);
    this.case();
  }

  private case() {
    this.notFound();
  }

  private notFound() {
    const idStuff = this.stuffArr.find((val) => val.key() === "id");
    const emailStuff = this.stuffArr.find((val) => val.key() === "email");
    const nickNameStuff = this.stuffArr.find((val) => val.key() === "nickname");

    if (
      this.error.message.includes("Could not find any entity of type") &&
      idStuff
    ) {
      throw new NotFoundException(
        `해당 아이디(${idStuff.value()})의 사용자를 찾을 수 없습니다. 검증 API를 먼저 사용해주세요.`,
      );
    }

    if (
      this.error.message.includes("Could not find any entity of type") &&
      emailStuff
    ) {
      throw new NotFoundException(
        `해당 이메일(${emailStuff.value()})을 가진 사용자를 찾을 수 없습니다. 검증 API를 먼저 사용해주세요.`,
      );
    }

    if (
      this.error.message.includes("Could not find any entity of type") &&
      nickNameStuff
    ) {
      throw new NotFoundException(
        `해당 닉네임(${nickNameStuff.value()})을 가진 사용자를 찾을 수 없습니다. 검증 API를 먼저 사용해주세요.`,
      );
    }
  }
}
