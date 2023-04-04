import { NotFoundException } from "@nestjs/common";

export class UserErrorCase {
  static init(error: Error, stuff: string, stuffMean: string) {
    if (
      error.message.includes("Could not find any entity of type") &&
      stuffMean === "아이디"
    ) {
      throw new NotFoundException(
        `해당 아이디(${stuff})의 사용자를 찾을 수 없습니다. 검증 API를 먼저 사용해주세요.`,
      );
    }

    if (
      error.message.includes("Could not find any entity of type") &&
      stuffMean === "이메일"
    ) {
      throw new NotFoundException(
        `해당 이메일(${stuff})을 가진 사용자를 찾을 수 없습니다. 검증 API를 먼저 사용해주세요.`,
      );
    }

    if (
      error.message.includes("Could not find any entity of type") &&
      stuffMean === "닉네임"
    ) {
      throw new NotFoundException(
        `해당 닉네임(${stuff})을 가진 사용자를 찾을 수 없습니다. 검증 API를 먼저 사용해주세요.`,
      );
    }
  }
}
