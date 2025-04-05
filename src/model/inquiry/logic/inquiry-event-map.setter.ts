import { Inject, Injectable } from "@nestjs/common";
import { SendMailToAdminAboutInquiryRequestDto } from "../dto/inquiry-request/response/send-mail-to-admin-about-inquiry-request.dto";
import { SendMailToClientAboutInquiryResponseDto } from "../dto/inquiry-response/response/send-mail-to-client-about-inquiry-response.dto";

@Injectable()
export class InquiryEventMapSetter {
  constructor(
    @Inject("mail-event-map")
    private readonly mailEventMap: Map<string, any>,
  ) {}

  public setClientEventParam(dto: SendMailToAdminAboutInquiryRequestDto): void {
    this.mailEventMap.set("inquiry-request", dto);
  }

  public setAdminEventParam(dto: SendMailToClientAboutInquiryResponseDto): void {
    this.mailEventMap.set("inquiry-response", dto);
  }
}
