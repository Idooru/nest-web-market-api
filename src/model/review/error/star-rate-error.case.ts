import { NotFoundException } from "@nestjs/common";

export class StarRateErrorCase {
  static init(error: Error, stuffs: string[], stuffMeans: string[]): void {
    // if (
    //   error.message.includes("Could not find any entity of type") &&
    //   stuffMean === "id"
    // ) {
    //   throw new NotFoundException(
    //     `해당 아이디(${stuff})의 별점을 찾을 수 없습니다. 검증 API를 먼저 사용해주세요.`,
    //   );
    // }
  }
}
