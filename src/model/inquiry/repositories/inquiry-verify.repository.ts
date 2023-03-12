import { Injectable } from "@nestjs/common";
import { RepositoryLogger } from "src/common/classes/repository.logger";

@Injectable()
export class InquiryVerifyRepository extends RepositoryLogger {
  constructor() {
    super();
  }
}
