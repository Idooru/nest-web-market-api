import { NotFoundException } from "@nestjs/common";

export class InquiryRequestErrorCase {
  static init(error: Error, stuff: string, stuffMean: string): void {
    if (
      error.message.includes("Could not find any entity of type") &&
      stuffMean === "id"
    ) {
      throw new NotFoundException(
        `해당 id(${stuff})을 가진 문의 요청을 찾을 수 없습니다.`,
      );
    }
  }
}
