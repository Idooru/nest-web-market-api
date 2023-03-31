import { MailerService } from "@nestjs-modules/mailer";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SendMailLogger } from "src/common/classes/send-mail.logger";
import { UserGeneralRepository } from "src/model/user/repositories/user-general.repository";
import { SendMailToClientDto } from "../../dto/response/send-mail-to-client.dto";
import { InquiryGeneralRepository } from "../../repositories/inquiry-general.repository";
import { InquiryInsertRepository } from "../../repositories/inquiry-insert.repository";

@Injectable()
export class InquiryResponseSendMailService extends SendMailLogger {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
    private readonly inquiryGeneralRepository: InquiryGeneralRepository,
    private readonly inquiryInsertRepository: InquiryInsertRepository,
    private readonly userGeneralRepository: UserGeneralRepository,
  ) {
    super();
  }

  async sendMailToClient(
    sendMailToClientDto: SendMailToClientDto,
  ): Promise<void> {
    const { clientUserId, inquiryRequestId } = sendMailToClientDto;

    const [clientUser, inquiryRequest] = await Promise.all([
      this.userGeneralRepository.findClientUserWithId(clientUserId),
      this.inquiryGeneralRepository.findInquiryRequestWithId(inquiryRequestId),
    ]);

    const inquiryResponse =
      await this.inquiryInsertRepository.findLastCreatedInquiryResponse();

    try {
      await this.mailerService.sendMail({
        to: clientUser.Auth.email,
        from: this.configService.get("MAIL_USER"),
        subject: "고객님, 서비스 관리자로부터 문의 응답이 도착하였습니다.",
        text: `고객님께서 작성하신 문의로부터 서비스 관리자가 문의 응답을 달아주었습니다.\n
        ----------------------------------------------------------------------
        문의 요청 상품 이름: ${inquiryRequest.Product.name}
        문의 요청 카테코리: ${inquiryRequest.categories}
        문의 요청 제목: ${inquiryRequest.title}
        문의 요청 내용: ${inquiryRequest.content}
        ----------------------------------------------------------------------
        문의 응답 제목: ${inquiryResponse.title}
        문의 응답 내용: ${inquiryResponse.content}
        ----------------------------------------------------------------------
        \n자세한 내용은 서비스에 접속하여서 고객님의 프로필을 확인해보시기 바랍니다.
        `,
      });
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }
}
