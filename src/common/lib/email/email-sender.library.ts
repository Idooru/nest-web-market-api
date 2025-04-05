import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CatchCallbackFactoryLibrary } from "../util/catch-callback-factory.library";
import { OnEvent } from "@nestjs/event-emitter";
import { eventConfigs } from "../../config/event-configs";
import { SendMailToClientAboutRegisterDto } from "../../../model/user/dto/response/send-mail-to-client-about-register.dto";
import { SendMailToAdminAboutInquiryRequestDto } from "../../../model/inquiry/dto/inquiry-request/response/send-mail-to-admin-about-inquiry-request.dto";
import { SendMailToClientAboutInquiryResponseDto } from "../../../model/inquiry/dto/inquiry-response/response/send-mail-to-client-about-inquiry-response.dto";

@Injectable()
export class EmailSenderLibrary {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
    private readonly callbackFactory: CatchCallbackFactoryLibrary,
  ) {}

  @OnEvent(eventConfigs.sendMailInquiryRequest, { async: true })
  public async sendMailToAdminAboutInquiryRequest(dto: SendMailToAdminAboutInquiryRequestDto): Promise<void> {
    const { product, inquiryRequest, clientUser } = dto;
    const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f9; padding: 20px;">
      <div style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); padding: 20px; max-width: 600px; margin: auto;">
        <h2 style="text-align: center; color: #333; font-size: 24px; margin-bottom: 20px;">사용자로부터 다음과 같은 문의가 들어왔습니다.</h2>
        <hr />
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li style="margin-bottom: 15px; font-size: 16px; color: #555;">
            <strong style="color: #333;">문의 요청 아이디:</strong> <span style="color: #888;">${inquiryRequest.id}</span>
          </li>
          <li style="margin-bottom: 15px; font-size: 16px; color: #555;">
            <strong style="color: #333;">문의 요청 상품 아이디:</strong> <span style="color: #888;">${product.id}</span>
          </li>
          <li style="margin-bottom: 15px; font-size: 16px; color: #555;">
            <strong style="color: #333;">문의 요청 사용자 아이디:</strong> <span style="color: #888;">${clientUser.id}</span>
          </li>
          <li style="margin-bottom: 15px; font-size: 16px; color: #555;">
            <strong style="color: #333;">문의 요청 상품 이름:</strong> <span style="color: #888;">${product.name}</span>
          </li>
          <li style="margin-bottom: 15px; font-size: 16px; color: #555;">
            <strong style="color: #333;">문의 요청 카테고리:</strong> <span style="color: #888;">${inquiryRequest.inquiryOption}</span>
          </li>
          <li style="margin-bottom: 15px; font-size: 16px; color: #555;">
            <strong style="color: #333;">문의 요청 제목:</strong> <span style="color: #888;">${inquiryRequest.title}</span>
          </li>
          <li style="margin-bottom: 15px; font-si ze: 16px; color: #555;">
            <strong style="color: #333;">문의 요청 내용:</strong> 
          </li>
          <li style="margin-bottom: 15px; font-si ze: 16px; color: #555;">
            <pre style="background: #f4f4f4; padding: 10px; border-radius: 5px;">${inquiryRequest.content}</pre>
          </li>
        </ul>
        <hr />
        <p style="font-size: 14px; color: #888; text-align: center;">자세한 내용은 관리자 페이지에 접속하여 문의 내용을 확인하고 사용자에게 질의 응답을 하시기 바랍니다.</p>
      </div>
    </div>
  `;

    await this.mailerService
      .sendMail({
        to: this.configService.get("MAIL_USER"),
        from: this.configService.get("MAIL_USER"),
        subject: "관리자님, 사용자로부터 문의 요청이 들어왔습니다.",
        html,
      })
      .catch(this.callbackFactory.getCatchSendMailFunc());
  }

  @OnEvent(eventConfigs.sendMailInquiryResponse, { async: true })
  public async sendMailToClientAboutInquiryResponse(dto: SendMailToClientAboutInquiryResponseDto): Promise<void> {
    const { inquiryRequester, inquiryRequest, inquiryResponse } = dto;
    const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f9; padding: 20px;">
      <div style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); padding: 20px; max-width: 600px; margin: auto;">
        <h2 style="text-align: center; color: #333; font-size: 24px; margin-bottom: 20px;">
          ${inquiryRequester.User.UserAuth.nickName}님께서 작성하신 문의로부터 서비스 관리자가 문의 응답을 달아주었습니다.
        </h2>
        <hr />
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li style="margin-bottom: 15px; font-size: 16px; color: #555;">
            <strong style="color: #333;">문의 요청 상품 이름:</strong> <span style="color: #888;">${inquiryRequest.Product.name}</span>
          </li>
          <li style="margin-bottom: 15px; font-size: 16px; color: #555;">
            <strong style="color: #333;">문의 요청 카테고리:</strong> <span style="color: #888;">${inquiryRequest.inquiryOption}</span>
          </li>
          <li style="margin-bottom: 15px; font-size: 16px; color: #555;">
            <strong style="color: #333;">문의 요청 제목:</strong> <span style="color: #888;">${inquiryRequest.title}</span>
          </li>
          <li style="margin-bottom: 15px; font-size: 16px; color: #555;">
            <strong style="color: #333;">문의 요청 내용:</strong>
          </li>
          <li style="margin-bottom: 15px; font-si ze: 16px; color: #555;">
            <pre style="background: #f4f4f4; padding: 10px; border-radius: 5px;">${inquiryRequest.content}</pre>
          </li>
        </ul>
        <hr />
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li style="margin-bottom: 15px; font-size: 16px; color: #555;">
            <strong style="color: #333;">문의 응답 제목:</strong> <span style="color: #888;">${inquiryResponse.title}</span>
          </li>
          <li style="margin-bottom: 15px; font-size: 16px; color: #555;">
            <strong style="color: #333;">문의 응답 내용:</strong> 
          </li>
          <li style="margin-bottom: 15px; font-si ze: 16px; color: #555;">
            <pre style="background: #f4f4f4; padding: 10px; border-radius: 5px;">${inquiryResponse.content}</pre>
          </li>
        </ul>
        <hr />
        <p style="font-size: 14px; color: #888; text-align: center;">
          자세한 내용은 서비스에 접속하여서 ${inquiryRequester.User.UserAuth.nickName}님의 프로필을 확인해보시기 바랍니다.
        </p>
      </div>
    </div>
  `;

    await this.mailerService
      .sendMail({
        to: inquiryRequester.User.UserAuth.email,
        from: this.configService.get("MAIL_USER"),
        subject: `${inquiryRequester.User.UserAuth.nickName}님, 서비스 관리자로부터 문의 응답이 도착하였습니다.`,
        html,
      })
      .catch(this.callbackFactory.getCatchSendMailFunc());
  }

  @OnEvent(eventConfigs.sendMailRegister, { async: true })
  public async sendMailToClientAboutRegister(dto: SendMailToClientAboutRegisterDto): Promise<void> {
    const { email, nickName } = dto;

    await this.mailerService
      .sendMail({
        to: email,
        from: this.configService.get("MAIL_USER"),
        subject: `${nickName}님, 저희 서비스에 회원 가입을 해주셔서 진심으로 감사드립니다!`,
        text: `환영합니다!`,
      })
      .catch(this.callbackFactory.getCatchSendMailFunc());
  }
}
