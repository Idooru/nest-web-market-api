import { BadRequestException, NotFoundException } from "@nestjs/common";
import { loggerFactory } from "src/common/functions/logger.factory";

export class ValidateLibrary {
  public isExistData(exist: boolean, criteria: string, payload: string): void {
    if (!exist) {
      const message = `존재하지 않은 ${criteria}(${payload})입니다.`;
      loggerFactory("None Exist").error(message);
      throw new NotFoundException(message);
    }
  }

  public isNoneExistData(exist: boolean, criteria: string, payload: string): void {
    if (exist) {
      const message = `이미 존재하는 ${criteria}(${payload})입니다.`;
      loggerFactory("Already Exist").error(message);
      throw new BadRequestException(message);
    }
  }
}
