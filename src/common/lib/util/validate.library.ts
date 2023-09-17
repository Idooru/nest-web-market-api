import { BadRequestException, NotFoundException } from "@nestjs/common";
import { loggerFactory } from "src/common/functions/logger.factory";

export class ValidateLibrary {
  isExistArray<T>(array: T[], criteria: string): void {
    if (!array.length) {
      const message = `${criteria}(이)가 존재하지 않습니다.`;
      loggerFactory("None Exist").error(message);
      throw new NotFoundException(message);
    }
  }

  isExistData<T>(data: T, criteria: string): void {
    if (!data) {
      const message = `${criteria}(이)가 존재하지 않습니다.`;
      loggerFactory("None Exist").error(message);
      throw new NotFoundException(message);
    }
  }

  isNoneExistData(exist: boolean, criteria: string): void {
    if (exist) {
      const message = `이미 존재하는 ${criteria}입니다.`;
      loggerFactory("Already Exist").error(message);
      throw new BadRequestException(message);
    }
  }
}
