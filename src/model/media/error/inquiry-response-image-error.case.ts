import { NotFoundException } from "@nestjs/common";
import { ErrorCaseProp } from "src/common/classes/abstract/error-case-prop";

export class InquiryResponseImageErrorCase extends ErrorCaseProp {
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
    const urlStuff = this.stuffArr.find((val) => val.key() === "url");

    if (
      this.error.message.includes("Could not find any entity of type") &&
      urlStuff
    ) {
      throw new NotFoundException(
        `해당 url(${urlStuff.value()})을 가진 문의 응답 이미지를 찾을 수 없습니다.`,
      );
    }
  }
}
