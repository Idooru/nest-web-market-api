import { Injectable } from "@nestjs/common";
import { InquiryRepositoryVO } from "../logic/transaction/inquiry-repository.vo";
import { CreateInquiryRequestDto } from "../dto/request/create-inquiry-request.dto";
import { InquiryRequestEntity } from "../entities/inquiry-request.entity";
import { InquiryRequestImageEntity } from "../../media/entities/inquiry-request-image.entity";
import { InquiryRequestVideoEntity } from "../../media/entities/inquiry-request-video.entity";
import { InquiryResponseImageEntity } from "../../media/entities/inquiry-response-image.entity";
import { InquiryResponseEntity } from "../entities/inquiry-response.entity";
import { InquiryResponseVideoEntity } from "../../media/entities/inquiry-response-video.entity";
import { CreateInquiryResponseDto } from "../dto/response/create-inquiry-response.dto";

@Injectable()
export class InquiryUpdateRepository {
  constructor(private readonly queryRunner: InquiryRepositoryVO) {}

  // Transaction
  public async createInquiryRequest(
    createInquiryRequestDto: CreateInquiryRequestDto,
  ): Promise<InquiryRequestEntity> {
    const { inquiryRequestBodyDto, product, client } = createInquiryRequestDto;

    return await this.queryRunner.inquiryRequestRepository.save({
      ...inquiryRequestBodyDto,
      Product: product,
      inquiryRequestWritter: client,
    });
  }

  // Transaction
  public async insertInquiryReuqestIdOnInquiryRequestImage(
    inquiryRequestImage: InquiryRequestImageEntity,
    inquiryRequest: InquiryRequestEntity,
  ): Promise<void> {
    inquiryRequestImage.InquiryRequest = inquiryRequest;
    await this.queryRunner.inquiryRequestImageRepository.save(
      inquiryRequestImage,
    );
  }

  // Transaction
  public async insertInquiryRequestIdOnInquiryRequestVideo(
    inquiryRequestVideo: InquiryRequestVideoEntity,
    inquiryRequest: InquiryRequestEntity,
  ): Promise<void> {
    inquiryRequestVideo.InquiryRequest = inquiryRequest;
    await this.queryRunner.inquiryRequestVideoRepository.save(
      inquiryRequestVideo,
    );
  }

  // Transaction
  public async createInquiryResponse(
    createInquiryResponseDto: CreateInquiryResponseDto,
  ): Promise<InquiryResponseEntity> {
    const { inquiryResponseBodyDto, inquiryRequest, admin } =
      createInquiryResponseDto;

    return await this.queryRunner.inquiryResponseRepository.save({
      ...inquiryResponseBodyDto,
      InquiryRequest: inquiryRequest,
      inquiryResponseWritter: admin,
    });
  }

  // Transaction
  public async insertInquiryResponseIdOnInquiryResponseImage(
    inquiryResponseImage: InquiryResponseImageEntity,
    inquiryResponse: InquiryResponseEntity,
  ): Promise<void> {
    inquiryResponseImage.InquiryResponse = inquiryResponse;
    await this.queryRunner.inquiryResponseImageRepository.save(
      inquiryResponseImage,
    );
  }

  // Transaction
  public async insertInquiryResponseIdOnInquiryResponseVideo(
    inquiryResponseVideo: InquiryResponseVideoEntity,
    inquiryResponse: InquiryResponseEntity,
  ): Promise<void> {
    inquiryResponseVideo.InquiryResponse = inquiryResponse;
    await this.queryRunner.inquiryResponseVideoRepository.save(
      inquiryResponseVideo,
    );
  }
}
