import { Injectable, PipeTransform } from "@nestjs/common";
import { Implemented } from "src/common/decorators/implemented.decoration";
import { InquiryValidator } from "../../logic/inquiry.validator";

@Injectable()
export class InquiryRequestIdValidatePipe implements PipeTransform {
  constructor(private readonly validator: InquiryValidator) {}

  @Implemented
  public async transform(id: string): Promise<string> {
    await this.validator.isExistRequestId(id);

    return id;
  }
}
