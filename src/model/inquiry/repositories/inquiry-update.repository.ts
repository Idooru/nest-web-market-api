import { Injectable } from "@nestjs/common";
import { InquiryRequestEntity } from "../entities/inquiry-request.entity";
import { InquiryRequestImageEntity } from "../../media/entities/inquiry-request-image.entity";
import { InquiryRequestVideoEntity } from "../../media/entities/inquiry-request-video.entity";
import { InquiryResponseImageEntity } from "../../media/entities/inquiry-response-image.entity";
import { InquiryResponseEntity } from "../entities/inquiry-response.entity";
import { InquiryResponseVideoEntity } from "../../media/entities/inquiry-response-video.entity";
import { Transactional } from "../../../common/interfaces/initializer/transactional";
import { InquiryRepositoryPayload } from "../logic/transaction/inquiry-repository.payload";
import { Transaction } from "../../../common/decorators/transaction.decorator";
import { CreateInquiryRequestRowDto } from "../dto/inquiry-request/request/create-inquiry-request.dto";
import { CreateInquiryResponseRowDto } from "../dto/inquiry-response/request/create-inquiry-response.dto";

@Injectable()
export class InquiryUpdateRepository {
  constructor(private readonly transaction: Transactional<InquiryRepositoryPayload>) {}

  @Transaction
  public createInquiryRequestRow(dto: CreateInquiryRequestRowDto): Promise<InquiryRequestEntity> {
    const { body, product, clientUser } = dto;

    return this.transaction.getRepository().inquiryRequest.save({
      ...body,
      Product: product,
      ClientUser: clientUser,
    });
  }

  @Transaction
  public async insertInquiryRequestIdOnInquiryRequestImage(
    inquiryRequestImage: InquiryRequestImageEntity,
    inquiryRequest: InquiryRequestEntity,
  ): Promise<void> {
    inquiryRequestImage.InquiryRequest = inquiryRequest;
    await this.transaction.getRepository().inquiryRequestImage.save(inquiryRequestImage);
  }

  @Transaction
  public async insertInquiryRequestIdOnInquiryRequestVideo(
    inquiryRequestVideo: InquiryRequestVideoEntity,
    inquiryRequest: InquiryRequestEntity,
  ): Promise<void> {
    inquiryRequestVideo.InquiryRequest = inquiryRequest;
    await this.transaction.getRepository().inquiryRequestVideo.save(inquiryRequestVideo);
  }

  @Transaction
  public createInquiryResponseRow(dto: CreateInquiryResponseRowDto): Promise<InquiryResponseEntity> {
    const { body, inquiryRequest, adminUser } = dto;

    return this.transaction.getRepository().inquiryResponse.save({
      ...body,
      InquiryRequest: inquiryRequest,
      AdminUser: adminUser,
    });
  }

  @Transaction
  public async modifyInquiryRequestAnswerState(id: string): Promise<void> {
    await this.transaction.getRepository().inquiryRequest.update(id, {
      isAnswered: true,
    });
  }

  @Transaction
  public async insertInquiryResponseIdOnInquiryResponseImage(
    inquiryResponseImage: InquiryResponseImageEntity,
    inquiryResponse: InquiryResponseEntity,
  ): Promise<void> {
    inquiryResponseImage.InquiryResponse = inquiryResponse;
    await this.transaction.getRepository().inquiryResponseImage.save(inquiryResponseImage);
  }

  @Transaction
  public async insertInquiryResponseIdOnInquiryResponseVideo(
    inquiryResponseVideo: InquiryResponseVideoEntity,
    inquiryResponse: InquiryResponseEntity,
  ): Promise<void> {
    inquiryResponseVideo.InquiryResponse = inquiryResponse;
    await this.transaction.getRepository().inquiryResponseVideo.save(inquiryResponseVideo);
  }
}
