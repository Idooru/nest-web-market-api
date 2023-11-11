import { Inject, Injectable } from "@nestjs/common";
import { SendMailToAdminAboutInquiryRequestDto } from "../dto/request/send-mail-to-admin-about-inquiry-request.dto";
import { SendMailToClientAboutInquiryResponseDto } from "../dto/response/send-mail-to-client-about-inquiry-response.dto";

@Injectable()
export class InquiryEventMapSetter {
  constructor(
    @Inject("MailEventMap")
    private readonly mailEventMap: Map<string, any>,
  ) {}

  public setClientEventParam(
    sendMailToAdminAboutInquiryRequestDto: SendMailToAdminAboutInquiryRequestDto,
  ): void {
    this.mailEventMap.set("client", sendMailToAdminAboutInquiryRequestDto);
  }

  public setAdminEventParam(
    sendMailToClientAboutInquiryResponseDto: SendMailToClientAboutInquiryResponseDto,
  ): void {
    this.mailEventMap.set("admin", sendMailToClientAboutInquiryResponseDto);
  }
}
