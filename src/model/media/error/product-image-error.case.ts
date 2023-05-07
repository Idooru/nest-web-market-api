import { NotFoundException } from "@nestjs/common";
import { ErrorCaseProp } from "src/common/classes/abstract/error-case-prop";

export class ProductImageErrorCase extends ErrorCaseProp {
  constructor(
    protected error: Error,
    protected stuffs: string[],
    protected stuffMeans: string[],
  ) {
    super(stuffs, stuffMeans);
    this.case();
  }

  private case() {
    this.notFound();
  }

  private notFound() {
    const idStuff = this.stuffArr.find((val) => val.key() === "id");
    const urlStuff = this.stuffArr.find((val) => val.key() === "url");
    const emailStuff = this.stuffArr.find((val) => val.key() === "email");

    if (urlStuff && emailStuff) {
      throw new NotFoundException(
        `해당 url(${urlStuff.value()})과 업로더(${emailStuff.value()})이 일치하지 않습니다.`,
      );
    }

    if (
      this.error.message.includes("Could not find any entity of type") &&
      idStuff
    ) {
      throw new NotFoundException(
        `해당 id(${idStuff.value()})를 가진 상품 이미지를 찾을 수 없습니다.`,
      );
    }

    if (
      this.error.message.includes("Could not find any entity of type") &&
      urlStuff
    ) {
      throw new NotFoundException(
        `해당 url(${urlStuff.value()})을 가진 상품 이미지를 찾을 수 없습니다. 검증 API를 먼저 사용해주세요.`,
      );
    }

    if (
      this.error.message.includes("Could not find any entity of type") &&
      emailStuff
    ) {
      throw new NotFoundException(
        `해당 업로더(${emailStuff.value()})을 가진 상품 이미지를 찾을 수 없습니다. `,
      );
    }
  }
}
