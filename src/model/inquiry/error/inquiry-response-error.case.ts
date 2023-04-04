import { NotFoundException } from "@nestjs/common";

export class InquiryResponseErrorCase {
  static init(error: Error, stuff: string, stuffMean: string): void {
    if (
      error.message.includes("Could not find any entity of type") &&
      stuffMean === "아이디"
    ) {
      throw new NotFoundException(
        `해당 id(${stuff})을 가진 문의 응답을 찾을 수 없습니다.`,
      );
    }
  }
}
