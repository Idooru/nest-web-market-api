import { NotFoundException } from "@nestjs/common";
import { loggerFactory } from "src/common/functions/logger.factory";

export class ValidateLibrary {
  private readonly message = "데이터가 존재하지 않습니다.";

  isExistArray<T>(array: T[]) {
    if (!array.length) {
      loggerFactory("Validate").error(this.message);
      throw new NotFoundException(this.message);
    }
  }

  isExistData<T>(data: T) {
    if (!data) {
      loggerFactory("Validate").error(this.message);
      throw new NotFoundException(this.message);
    }
  }
}
