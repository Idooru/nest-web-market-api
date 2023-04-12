import { NotFoundException } from "@nestjs/common";
import { ErrorCaseProp } from "src/common/classes/error-case-prop";

export class ReviewVideoErrorCase extends ErrorCaseProp {
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
        `해당 url(${urlStuff.value()})을 가진 리뷰 동영상을 찾을 수 없습니다. 검증 API를 먼저 사용해주세요.`,
      );
    }
  }
}
