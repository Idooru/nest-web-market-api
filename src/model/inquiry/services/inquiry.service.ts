import { Injectable } from "@nestjs/common";
import { InquiryUpdateRepository } from "../repositories/inquiry-update.repository";
import { InquiryRequestEntity } from "../entities/inquiry-request.entity";
import { InquiryResponseEntity } from "../entities/inquiry-response.entity";
import { Transaction } from "../../../common/decorators/transaction.decorator";
import { CreateInquiryRequestRowDto } from "../dto/inquiry-request/request/create-inquiry-request.dto";
import { InsertInquiryRequestImageDto } from "../dto/inquiry-request/request/insert-inquiry-request-image.dto";
import { InsertInquiryRequestVideoDto } from "../dto/inquiry-request/request/insert-inquiry-request-video.dto";
import { CreateInquiryResponseRowDto } from "../dto/inquiry-response/request/create-inquiry-response.dto";
import { InsertInquiryResponseImageDto } from "../dto/inquiry-response/request/insert-inquiry-response-image.dto";
import { InsertInquiryResponseVideoDto } from "../dto/inquiry-response/request/insert-inquiry-response-video.dto";

@Injectable()
export class InquiryService {
  constructor(private readonly inquiryOperationRepository: InquiryUpdateRepository) {}

  @Transaction
  public createInquiryRequest(dto: CreateInquiryRequestRowDto): Promise<InquiryRequestEntity> {
    return this.inquiryOperationRepository.createInquiryRequestRow(dto);
  }

  @Transaction
  public async insertInquiryRequestImages(dto: InsertInquiryRequestImageDto): Promise<void> {
    const { inquiryRequestImages, inquiryRequest } = dto;

    const inserting = inquiryRequestImages.map((inquiryRequestImage) =>
      this.inquiryOperationRepository.insertInquiryRequestIdOnInquiryRequestImage(inquiryRequestImage, inquiryRequest),
    );

    await Promise.all(inserting);
  }

  @Transaction
  public async insertInquiryRequestVideos(dto: InsertInquiryRequestVideoDto): Promise<void> {
    const { inquiryRequestVideos, inquiryRequest } = dto;

    const inserting = inquiryRequestVideos.map((inquiryRequestVideo) =>
      this.inquiryOperationRepository.insertInquiryRequestIdOnInquiryRequestVideo(inquiryRequestVideo, inquiryRequest),
    );

    await Promise.all(inserting);
  }

  @Transaction
  public createInquiryResponse(dto: CreateInquiryResponseRowDto): Promise<InquiryResponseEntity> {
    return this.inquiryOperationRepository.createInquiryResponseRow(dto);
  }

  @Transaction
  public async modifyInquiryRequestAnswerState(id: string): Promise<void> {
    await this.inquiryOperationRepository.modifyInquiryRequestAnswerState(id);
  }

  @Transaction
  public async insertInquiryResponseImages(dto: InsertInquiryResponseImageDto): Promise<void> {
    const { inquiryResponseImages, inquiryResponse } = dto;

    const inserting = inquiryResponseImages.map((inquiryResponseImage) =>
      this.inquiryOperationRepository.insertInquiryResponseIdOnInquiryResponseImage(
        inquiryResponseImage,
        inquiryResponse,
      ),
    );

    await Promise.all(inserting);
  }

  @Transaction
  public async insertInquiryResponseVideos(dto: InsertInquiryResponseVideoDto): Promise<void> {
    const { inquiryResponseVideos, inquiryResponse } = dto;

    const inserting = inquiryResponseVideos.map((inquiryResponseVideo) =>
      this.inquiryOperationRepository.insertInquiryResponseIdOnInquiryResponseVideo(
        inquiryResponseVideo,
        inquiryResponse,
      ),
    );

    await Promise.all(inserting);
  }
}
