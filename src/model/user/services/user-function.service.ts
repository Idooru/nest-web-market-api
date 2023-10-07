import { Injectable } from "@nestjs/common";
import { EmailSenderLibrary } from "../../../common/lib/email/email-sender.library";
import { SendMailToClientAboutRegisterDto } from "../dtos/send-mail-to-client-about-register.dto";

@Injectable()
export class UserFunctionService {
  constructor(private readonly emailSenderLibrary: EmailSenderLibrary) {}

  public getSendMailToClientAboutRegister(
    sendMailToClientAboutRegisterDto: SendMailToClientAboutRegisterDto,
  ): () => Promise<void> {
    return async () =>
      await this.emailSenderLibrary.sendMailToClientAboutRegister(
        sendMailToClientAboutRegisterDto,
      );
  }
}
