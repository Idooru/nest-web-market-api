import { Injectable } from "@nestjs/common";
import { CreateInquiryRequestDto } from "../dto/request/create-inquiry-request.dto";
import { InquiryRequestEntity } from "../entities/inquiry-request.entity";
import { InquiryRequestImageEntity } from "../../media/entities/inquiry-request-image.entity";
import { InquiryRequestVideoEntity } from "../../media/entities/inquiry-request-video.entity";
import { InquiryResponseImageEntity } from "../../media/entities/inquiry-response-image.entity";
import { InquiryResponseEntity } from "../entities/inquiry-response.entity";
import { InquiryResponseVideoEntity } from "../../media/entities/inquiry-response-video.entity";
import { CreateInquiryResponseDto } from "../dto/response/create-inquiry-response.dto";
import { Transactional } from "../../../common/interfaces/initializer/transactional";
import { InquiryRepositoryPayload } from "../logic/transaction/inquiry-repository.payload";

@Injectable()
export class InquiryUpdateRepository {
  constructor(
    private readonly transaction: Transactional<InquiryRepositoryPayload>,
  ) {}

  // Transaction
  public createInquiryRequest(
    createInquiryRequestDto: CreateInquiryRequestDto,
  ): Promise<InquiryRequestEntity> {
    const { inquiryRequestBodyDto, product, clientUser } =
      createInquiryRequestDto;

    return this.transaction.getRepository().inquiryRequest.save({
      ...inquiryRequestBodyDto,
      Product: product,
      inquiryRequestWritter: clientUser,
    });
  }

  // Transaction
  public async insertInquiryReuqestIdOnInquiryRequestImage(
    inquiryRequestImage: InquiryRequestImageEntity,
    inquiryRequest: InquiryRequestEntity,
  ): Promise<void> {
    inquiryRequestImage.InquiryRequest = inquiryRequest;
    await this.transaction
      .getRepository()
      .inquiryRequestImage.save(inquiryRequestImage);
  }

  // Transaction
  public async insertInquiryRequestIdOnInquiryRequestVideo(
    inquiryRequestVideo: InquiryRequestVideoEntity,
    inquiryRequest: InquiryRequestEntity,
  ): Promise<void> {
    inquiryRequestVideo.InquiryRequest = inquiryRequest;
    await this.transaction
      .getRepository()
      .inquiryRequestVideo.save(inquiryRequestVideo);
  }

  // Transaction
  public createInquiryResponse(
    createInquiryResponseDto: CreateInquiryResponseDto,
  ): Promise<InquiryResponseEntity> {
    const { inquiryResponseBodyDto, inquiryRequest, admin } =
      createInquiryResponseDto;

    return this.transaction.getRepository().inquiryResponse.save({
      ...inquiryResponseBodyDto,
      InquiryRequest: inquiryRequest,
      inquiryResponseWritter: admin,
    });
  }

  // Transaction
  public async modifyInquiryRequestAnswerState(id: string): Promise<void> {
    await this.transaction.getRepository().inquiryRequest.update(id, {
      isAnswerd: true,
    });
  }

  // Transaction
  public async insertInquiryResponseIdOnInquiryResponseImage(
    inquiryResponseImage: InquiryResponseImageEntity,
    inquiryResponse: InquiryResponseEntity,
  ): Promise<void> {
    inquiryResponseImage.InquiryResponse = inquiryResponse;
    await this.transaction
      .getRepository()
      .inquiryResponseImage.save(inquiryResponseImage);
  }

  // Transaction
  public async insertInquiryResponseIdOnInquiryResponseVideo(
    inquiryResponseVideo: InquiryResponseVideoEntity,
    inquiryResponse: InquiryResponseEntity,
  ): Promise<void> {
    inquiryResponseVideo.InquiryResponse = inquiryResponse;
    await this.transaction
      .getRepository()
      .inquiryResponseVideo.save(inquiryResponseVideo);
  }
}
