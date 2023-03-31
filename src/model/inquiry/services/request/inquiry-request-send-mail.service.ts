import { MailerService } from "@nestjs-modules/mailer";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SendMailLogger } from "src/common/classes/send-mail.logger";
import { ProductGeneralRepository } from "src/model/product/repositories/product-general.repository";
import { InquiryInsertRepository } from "../../repositories/inquiry-insert.repository";

@Injectable()
export class InquiryRequestSendMailService extends SendMailLogger {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
    private readonly inquiryInsertRepository: InquiryInsertRepository,
    private readonly productGeneralRepository: ProductGeneralRepository,
  ) {
    super();
  }

  async sendMailToAdmin(productId: string): Promise<void> {
    const [product, inquiryRequest] = await Promise.all([
      this.productGeneralRepository.findProductOneById(productId),
      this.inquiryInsertRepository.findLastCreatedInquiryRequest(),
    ]);

    try {
      await this.mailerService.sendMail({
        to: this.configService.get("MAIL_USER"),
        from: this.configService.get("MAIL_USER"),
        subject: "관리자님, 사용자로부터 문의 요청이 들어왔습니다.",
        text: `사용자로 부터 다음과 같은 문의가 들어왔습니다.\n
        ----------------------------------------------------------------------
        문의 요청 상품 아이디: ${product.id}
        문의 요청 상품 이름: ${product.name}  
        문의 요청 카테고리: ${inquiryRequest.categories}
        문의 요청 내용: ${inquiryRequest.title}
        문의 요청 내용: ${inquiryRequest.content}
        
        \n자세한 내용은 관리자 페이지에 접속하여 문의 내용을 확인하고 사용자에게 질의 응답을 하시기 바랍니다.
        `,
      });
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }
}
