import { Injectable, PipeTransform } from "@nestjs/common";
import { InquiryValidator } from "../../logic/inquiry.validator";
import { Implemented } from "../../../../common/decorators/implemented.decoration";

@Injectable()
export class InquiryResponseIdValidatePipe implements PipeTransform {
  constructor(private readonly validator: InquiryValidator) {}

  @Implemented
  public async transform(id: string): Promise<string> {
    await this.validator.isExistResponseId(id);

    return id;
  }
}
