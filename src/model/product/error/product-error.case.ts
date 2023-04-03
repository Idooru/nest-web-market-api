import { BadRequestException, NotFoundException } from "@nestjs/common";

export class ProductErrorCase {
  static init(error: Error, stuff?: string, stuffMean?: string): void {
    if (
      error.message.includes("Could not find any entity of type") &&
      stuffMean === "이름"
    ) {
      throw new NotFoundException(
        `해당 이름(${stuff})의 상품을 찾을 수 없습니다. 검증 API를 사용하지 않았습니까?`,
      );
    }

    if (
      error.message.includes("Could not find any entity of type") &&
      stuffMean === "아이디"
    ) {
      throw new NotFoundException(
        `해당 아이디(${stuff})의 상품을 찾을 수 없습니다. 검증 API를 사용하지 않았습니까?`,
      );
    }

    if (error.message.includes("Out of range value for column")) {
      throw new BadRequestException(
        "가격 혹은 수량을 마이너스로 수정 할 수 없습니다.",
      );
    }
  }
}
