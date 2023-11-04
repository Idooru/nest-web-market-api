import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SendMailToClientAboutInquiryResponseDto } from "src/model/inquiry/dto/response/send-mail-to-client-about-inquiry-response.dto";
import { SendMailToAdminAboutInquiryRequestDto } from "src/model/inquiry/dto/request/send-mail-to-admin-about-inquiry-request.dto";
import { SendMailToClientAboutRegisterDto } from "../../../model/user/dtos/send-mail-to-client-about-register.dto";
import { CatchCallbackFactoryLibrary } from "../util/catch-callback-factory.library";
import { OnEvent } from "@nestjs/event-emitter";
import { eventConfigs } from "../../config/event-configs";

@Injectable()
export class EmailSenderLibrary {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
    private readonly callbackFactory: CatchCallbackFactoryLibrary,
  ) {}

  @OnEvent(eventConfigs.sendMailInquiryRequest, { async: true })
  async sendMailToAdminAboutInquiryRequest(
    sendMailToAdminAboutInquiryRequestDto: SendMailToAdminAboutInquiryRequestDto,
  ): Promise<void> {
    const { product, inquiryRequest, client } =
      sendMailToAdminAboutInquiryRequestDto;
    await this.mailerService
      .sendMail({
        to: this.configService.get("MAIL_USER"),
        from: this.configService.get("MAIL_USER"),
        subject: "관리자님, 사용자로부터 문의 요청이 들어왔습니다.",
        text: `사용자로 부터 다음과 같은 문의가 들어왔습니다.\n
        ----------------------------------------------------------------------
        문의 요청 상품 아이디: ${product.id}
        문의 요청 사용자 아이디: ${client.id}
        문의 요청 상품 이름: ${product.name}
        문의 요청 카테고리: ${inquiryRequest.categories}
        문의 요청 내용: ${inquiryRequest.title}
        문의 요청 내용: ${inquiryRequest.content}
        ----------------------------------------------------------------------
        \n자세한 내용은 관리자 페이지에 접속하여 문의 내용을 확인하고 사용자에게 질의 응답을 하시기 바랍니다.
        `,
      })
      .catch(this.callbackFactory.getCatchSendMailFunc());
  }

  @OnEvent(eventConfigs.sendMailInquiryResponse, { async: true })
  async sendMailToClientAboutInquiryResponse(
    sendMailToClientAboutInquiryResponseDto: SendMailToClientAboutInquiryResponseDto,
  ): Promise<void> {
    const { inquiryRequester, inquiryRequest, inquiryResponse } =
      sendMailToClientAboutInquiryResponseDto;

    await this.mailerService
      .sendMail({
        to: inquiryRequester.User.Auth.email,
        from: this.configService.get("MAIL_USER"),
        subject: `${inquiryRequester.User.Auth.nickname}님, 서비스 관리자로부터 문의 응답이 도착하였습니다.`,
        text: `${inquiryRequester.User.Auth.nickname}님께서 작성하신 문의로부터 서비스 관리자가 문의 응답을 달아주었습니다.\n
          ----------------------------------------------------------------------
          문의 요청 상품 이름: ${inquiryRequest.Product.name}
          문의 요청 카테코리: ${inquiryRequest.categories}
          문의 요청 제목: ${inquiryRequest.title}
          문의 요청 내용: ${inquiryRequest.content}
          ----------------------------------------------------------------------
          문의 응답 제목: ${inquiryResponse.title}
          문의 응답 내용: ${inquiryResponse.content}
          ----------------------------------------------------------------------
          \n자세한 내용은 서비스에 접속하여서 ${inquiryRequester.User.Auth.nickname}님의 프로필을 확인해보시기 바랍니다.
          `,
      })
      .catch(this.callbackFactory.getCatchSendMailFunc());
  }

  @OnEvent(eventConfigs.sendMailRegister, { async: true })
  async sendMailToClientAboutRegister(
    sendMailToClientAboutRegisterDto: SendMailToClientAboutRegisterDto,
  ): Promise<void> {
    const { email, nickname } = sendMailToClientAboutRegisterDto;

    await this.mailerService
      .sendMail({
        to: email,
        from: this.configService.get("MAIL_USER"),
        subject: `${nickname}님, 저희 서비스에 회원 가입을 해주셔서 진심으로 감사드립니다!`,
        text: `환영합니다!`,
      })
      .catch(this.callbackFactory.getCatchSendMailFunc());
  }
}
