import { NotFoundException } from "@nestjs/common";
import { ErrorCaseProp } from "src/common/classes/abstract/error-case-prop";

export class InquiryResponseErrorCase extends ErrorCaseProp {
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

    if (
      this.error.message.includes("Could not find any entity of type") &&
      idStuff
    ) {
      throw new NotFoundException(
        `해당 id(${idStuff.value()})을 가진 문의 응답을 찾을 수 없습니다.`,
      );
    }
  }
}
