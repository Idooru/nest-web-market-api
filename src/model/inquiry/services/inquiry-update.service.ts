import { Injectable } from "@nestjs/common";
import { CreateInquiryRequestDto } from "../dto/request/create-inquiry-request.dto";
import { InquiryUpdateRepository } from "../repositories/inquiry-update.repository";
import { InquiryRequestEntity } from "../entities/inquiry-request.entity";
import { InsertInquiryRequestImageDto } from "../dto/request/insert-inquiry-request-image.dto";
import { InsertInquiryRequestVideoDto } from "../dto/request/insert-inquiry-request-video.dto";
import { InsertInquiryResponseImageDto } from "../dto/response/insert-inquiry-response-image.dto";
import { InsertInquiryResponseVideoDto } from "../dto/response/insert-inquiry-response-video.dto";
import { CreateInquiryResponseDto } from "../dto/response/create-inquiry-response.dto";
import { InquiryResponseEntity } from "../entities/inquiry-response.entity";

@Injectable()
export class InquiryUpdateService {
  constructor(
    private readonly inquiryOperationRepository: InquiryUpdateRepository,
  ) {}

  // Transaction
  public async createInquiryRequest(
    createInquiryRequestDto: CreateInquiryRequestDto,
  ): Promise<InquiryRequestEntity> {
    return await this.inquiryOperationRepository.createInquiryRequest(
      createInquiryRequestDto,
    );
  }

  // Transaction
  public async insertInquiryRequestImages(
    insertInquiryRequestImageDto: InsertInquiryRequestImageDto,
  ): Promise<void> {
    const { inquiryRequestImages, inquiryRequest } =
      insertInquiryRequestImageDto;

    const inserting = inquiryRequestImages.map((inquiryRequestImage) =>
      this.inquiryOperationRepository.insertInquiryReuqestIdOnInquiryRequestImage(
        inquiryRequestImage,
        inquiryRequest,
      ),
    );

    await Promise.all(inserting);
  }

  // Transaction
  public async insertInquiryRequestVideos(
    insertInquiryRequestVideoDto: InsertInquiryRequestVideoDto,
  ): Promise<void> {
    const { inquiryRequestVideos, inquiryRequest } =
      insertInquiryRequestVideoDto;

    const inserting = inquiryRequestVideos.map((inquiryRequestVideo) =>
      this.inquiryOperationRepository.insertInquiryRequestIdOnInquiryRequestVideo(
        inquiryRequestVideo,
        inquiryRequest,
      ),
    );

    await Promise.all(inserting);
  }

  // Transaction
  public async createInquiryResponse(
    createInquiryResponseDto: CreateInquiryResponseDto,
  ): Promise<InquiryResponseEntity> {
    return await this.inquiryOperationRepository.createInquiryResponse(
      createInquiryResponseDto,
    );
  }

  // Transaction
  public async modifyInquiryRequestAnswerState(id: string): Promise<void> {
    await this.inquiryOperationRepository.modifyInquiryRequestAnswerState(id);
  }

  // Transaction
  public async insertInquiryResponseImages(
    insertInquiryResponseImageDto: InsertInquiryResponseImageDto,
  ): Promise<void> {
    const { inquiryResponseImages, inquiryResponse } =
      insertInquiryResponseImageDto;

    const inserting = inquiryResponseImages.map((inquiryResponseImage) =>
      this.inquiryOperationRepository.insertInquiryResponseIdOnInquiryResponseImage(
        inquiryResponseImage,
        inquiryResponse,
      ),
    );

    await Promise.all(inserting);
  }

  // Transaction
  public async insertInquiryResponseVideos(
    insertInquiryResponseVideoDto: InsertInquiryResponseVideoDto,
  ): Promise<void> {
    const { inquiryResponseVideos, inquiryResponse } =
      insertInquiryResponseVideoDto;

    const inserting = inquiryResponseVideos.map((inquiryResponseVideo) =>
      this.inquiryOperationRepository.insertInquiryResponseIdOnInquiryResponseVideo(
        inquiryResponseVideo,
        inquiryResponse,
      ),
    );

    await Promise.all(inserting);
  }
}
