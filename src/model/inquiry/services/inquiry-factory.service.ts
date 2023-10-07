import { Injectable } from "@nestjs/common";
import { InquiryUpdateService } from "./inquiry-update.service";
import { InsertInquiryRequestImageDto } from "../dto/request/insert-inquiry-request-image.dto";
import { InsertInquiryRequestVideoDto } from "../dto/request/insert-inquiry-request-video.dto";
import { InsertInquiryResponseImageDto } from "../dto/response/insert-inquiry-response-image.dto";
import { InsertInquiryResponseVideoDto } from "../dto/response/insert-inquiry-response-video.dto";
import { SendMailToAdminAboutInquiryRequestDto } from "../dto/request/send-mail-to-admin-about-inquiry-request.dto";
import { EmailSenderLibrary } from "../../../common/lib/email/email-sender.library";
import { SendMailToClientAboutInquiryResponseDto } from "../dto/response/send-mail-to-client-about-inquiry-response.dto";

@Injectable()
export class InquiryFactoryService {
  constructor(
    private readonly inquiryOpeartionService: InquiryUpdateService,
    private readonly emailSenderLibrary: EmailSenderLibrary,
  ) {}

  public getInsertInquiryRequestImagesFunc(
    insertInquiryRequestImageDto: InsertInquiryRequestImageDto,
  ): () => Promise<void> {
    return async () =>
      await this.inquiryOpeartionService.insertInquiryRequestImages(
        insertInquiryRequestImageDto,
      );
  }

  public getInsertInquiryRequestVideosFunc(
    insertInquiryRequestVideoDto: InsertInquiryRequestVideoDto,
  ): () => Promise<void> {
    return async () =>
      await this.inquiryOpeartionService.insertInquiryRequestVideos(
        insertInquiryRequestVideoDto,
      );
  }

  public getSendMailToAdminAboutInquiryRequestFunc(
    sendMailToAdminAboutInquiryRequestDto: SendMailToAdminAboutInquiryRequestDto,
  ): () => Promise<void> {
    return async () =>
      await this.emailSenderLibrary.sendMailToAdminAboutInquiryRequest(
        sendMailToAdminAboutInquiryRequestDto,
      );
  }

  public getInsertInquiryResponseImagesFunc(
    insertInquiryResponseImageDto: InsertInquiryResponseImageDto,
  ): () => Promise<void> {
    return async () =>
      await this.inquiryOpeartionService.insertInquiryResponseImages(
        insertInquiryResponseImageDto,
      );
  }

  public getInsertInquiryResponseVideosFunc(
    insertInquiryResponseVideoDto: InsertInquiryResponseVideoDto,
  ): () => Promise<void> {
    return async () =>
      await this.inquiryOpeartionService.insertInquiryResponseVideos(
        insertInquiryResponseVideoDto,
      );
  }

  public getSendMailToClientAboutInquiryResponseFunc(
    sendMailToClientAboutInquiryResponseDto: SendMailToClientAboutInquiryResponseDto,
  ): () => Promise<void> {
    return async () =>
      await this.emailSenderLibrary.sendMailToClientAboutInquiryResponse(
        sendMailToClientAboutInquiryResponseDto,
      );
  }
}
