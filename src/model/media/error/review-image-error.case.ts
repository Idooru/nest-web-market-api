import { NotFoundException } from "@nestjs/common";

export class ReviewImageErrorCase {
  static init(error: Error, stuff: string, stuffMean: string): void {
    if (
      error.message.includes("Could not find any entity of type") &&
      stuffMean === "url"
    ) {
      throw new NotFoundException(
        `해당 url(${stuff})을 가진 리뷰 이미지를 찾을 수 없습니다. 검증 API를 먼저 사용해주세요.`,
      );
    }
  }
}
