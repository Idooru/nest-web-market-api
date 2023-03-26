import { MailerService } from "@nestjs-modules/mailer";
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ProductGeneralRepository } from "src/model/product/repositories/product-general.repository";
import { UserGeneralRepository } from "src/model/user/repositories/user-general.repository";
import { SendMailDto } from "../dto/request/send-mail.dto";
import { InquiryGeneralRepository } from "../repositories/inquiry-general.repository";

@Injectable()
export class InquirySendMailService {
  constructor(
    private readonly inquiryGeneralRepository: InquiryGeneralRepository,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
    private readonly userGeneralRepository: UserGeneralRepository,
    private readonly productGeneralRepository: ProductGeneralRepository,
  ) {}

  private readonly logger = new Logger("SendMailService");

  async sendMailToAdmin(sendMailDto: SendMailDto) {
    const { userId, productId } = sendMailDto;
    const [user, product] = await Promise.all([
      this.userGeneralRepository.findClientUserWithId(userId),
      this.productGeneralRepository.findProductOneById(productId),
    ]);

    const inquiryRequest =
      await this.inquiryGeneralRepository.findLastCreatedOneInquiryRequestWithUserId(
        user.clientActions.id,
      );

    try {
      await this.mailerService.sendMail({
        to: this.configService.get("MAIL_USER"),
        from: this.configService.get("MAIL_USER"),
        subject: "관리자님, 사용자로부터 문의가 들어왔습니다.",
        text: `상품(id:${product.id},name:${product.name})으로 다음과 같은 문의가 들어왔습니다.\n
      문의 카테고리: ${inquiryRequest.categories}
      문의 내용: ${inquiryRequest.title}
      문의 내용: ${inquiryRequest.content}
      \n자세한 내용은 관리자 페이지에 접속하여 문의 내용을 확인하고 사용자에게 질의 응답을 하시기 바랍니다.
      `,
      });
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }
}
