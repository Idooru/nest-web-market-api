import { NotFoundException } from "@nestjs/common";

export class InquiryResponseVideoErrorCase {
  static init(error: Error, stuff: string, stuffMean: string): void {
    if (
      error.message.includes("Could not find any entity of type") &&
      stuffMean === "url"
    ) {
      throw new NotFoundException(
        `해당 url(${stuff})을 가진 문의 응답 동영상을 찾을 수 없습니다.`,
      );
    }
  }
}
