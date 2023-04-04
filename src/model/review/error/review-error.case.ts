import { NotFoundException } from "@nestjs/common";

export class ReviewErrorCase {
  static init(error: Error, stuff: string, stuffMean: string): void {
    if (
      error.message.includes("Could not find any entity of type") &&
      stuffMean === "아이디"
    ) {
      throw new NotFoundException(
        `해당 아이디(${stuff})의 리뷰를 찾을 수 없습니다. 검증 API를 먼저 사용해주세요.`,
      );
    }
  }
}
