import { Injectable } from "@nestjs/common";
import { InquiryUpdateService } from "../../services/inquiry-update.service";
import { InquiryFactoryService } from "../../services/inquiry-factory.service";
import { InquiryEventMapSetter } from "../inquiry-event-map.setter";
import { SearchCreateInquiryRequestDto } from "../../dto/request/search-create-inquiry-request.dto";
import { SearchCreateInquiryResponseDto } from "../../dto/response/search-create-inquiry-response.dto";

@Injectable()
export class InquiryTransactionContext {
  constructor(
    private readonly inquiryUpdateService: InquiryUpdateService,
    private readonly inquiryFactoryService: InquiryFactoryService,
    private readonly inquiryEventMapSetter: InquiryEventMapSetter,
  ) {}

  public createInquiryRequestContext(
    dto: SearchCreateInquiryRequestDto,
  ): () => Promise<void> {
    const {
      inquiryRequestImages,
      inquiryRequestVideos,
      inquiryRequestBodyDto,
      product,
      clientUser,
    } = dto;

    return async () => {
      const inquiryRequest =
        await this.inquiryUpdateService.createInquiryRequest({
          inquiryRequestBodyDto,
          product,
          clientUser,
        });

      const imageWork =
        this.inquiryFactoryService.getInsertInquiryRequestImagesFunc({
          inquiryRequestImages,
          inquiryRequest,
        });

      const videoWork =
        this.inquiryFactoryService.getInsertInquiryRequestVideosFunc({
          inquiryRequestVideos,
          inquiryRequest,
        });

      this.inquiryEventMapSetter.setClientEventParam({
        product,
        inquiryRequest,
        clientUser,
      });

      await Promise.all([imageWork(), videoWork()]);
    };
  }

  public createInquiryResponseContext(
    dto: SearchCreateInquiryResponseDto,
  ): () => Promise<void> {
    const {
      inquiryRequest,
      inquiryResponseBodyDto,
      inquiryResponseImages,
      inquiryResponseVideos,
      inquiryRequester,
      inquiryResponser,
    } = dto;

    return async () => {
      const inquiryResponse =
        await this.inquiryUpdateService.createInquiryResponse({
          inquiryResponseBodyDto,
          admin: inquiryResponser,
          inquiryRequest,
        });

      await this.inquiryUpdateService.modifyInquiryRequestAnswerState(
        inquiryRequest.id,
      );

      const imageWork =
        this.inquiryFactoryService.getInsertInquiryResponseImagesFunc({
          inquiryResponseImages,
          inquiryResponse,
        });

      const videoWork =
        this.inquiryFactoryService.getInsertInquiryResponseVideosFunc({
          inquiryResponseVideos,
          inquiryResponse,
        });

      this.inquiryEventMapSetter.setAdminEventParam({
        inquiryRequester,
        inquiryRequest,
        inquiryResponse,
      });

      await Promise.all([imageWork(), videoWork()]);
    };
  }
}
