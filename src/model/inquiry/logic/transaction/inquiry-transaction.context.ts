import { Injectable } from "@nestjs/common";
import { InquiryService } from "../../services/inquiry.service";
import { InquiryEventMapSetter } from "../inquiry-event-map.setter";
import { SearchCreateInquiryRequestDto } from "../../dto/request/search-create-inquiry-request.dto";
import { SearchCreateInquiryResponseDto } from "../../dto/response/search-create-inquiry-response.dto";

@Injectable()
export class InquiryTransactionContext {
  constructor(
    private readonly inquieryService: InquiryService,
    private readonly inquiryEventMapSetter: InquiryEventMapSetter,
  ) {}

  public createInquiryRequestContext(dto: SearchCreateInquiryRequestDto): () => Promise<void> {
    const { inquiryRequestImages, inquiryRequestVideos, inquiryRequestBodyDto, product, clientUser } = dto;

    return async () => {
      const inquiryRequest = await this.inquieryService.createInquiryRequest({
        inquiryRequestBodyDto,
        product,
        clientUser,
      });

      const imageWork = async () => {
        await this.inquieryService.insertInquiryRequestImages({
          inquiryRequestImages,
          inquiryRequest,
        });
      };

      const videoWork = async () => {
        await this.inquieryService.insertInquiryRequestVideos({
          inquiryRequestVideos,
          inquiryRequest,
        });
      };

      this.inquiryEventMapSetter.setClientEventParam({
        product,
        inquiryRequest,
        clientUser,
      });

      await Promise.all([imageWork(), videoWork()]);
    };
  }

  public createInquiryResponseContext(dto: SearchCreateInquiryResponseDto): () => Promise<void> {
    const {
      inquiryRequest,
      inquiryResponseBodyDto,
      inquiryResponseImages,
      inquiryResponseVideos,
      inquiryRequester,
      inquiryResponser,
    } = dto;

    return async () => {
      const inquiryResponse = await this.inquieryService.createInquiryResponse({
        inquiryResponseBodyDto,
        admin: inquiryResponser,
        inquiryRequest,
      });

      await this.inquieryService.modifyInquiryRequestAnswerState(inquiryRequest.id);

      const imageWork = async () => {
        await this.inquieryService.insertInquiryResponseImages({
          inquiryResponseImages,
          inquiryResponse,
        });
      };

      const videoWork = async () => {
        await this.inquieryService.insertInquiryResponseVideos({
          inquiryResponseVideos,
          inquiryResponse,
        });
      };

      this.inquiryEventMapSetter.setAdminEventParam({
        inquiryRequester,
        inquiryRequest,
        inquiryResponse,
      });

      await Promise.all([imageWork(), videoWork()]);
    };
  }
}
