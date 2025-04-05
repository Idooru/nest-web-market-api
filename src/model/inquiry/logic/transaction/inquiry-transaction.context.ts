import { Injectable } from "@nestjs/common";
import { InquiryService } from "../../services/inquiry.service";
import { InquiryEventMapSetter } from "../inquiry-event-map.setter";
import { SearchCreateInquiryRequestDto } from "../../dto/inquiry-request/request/search-create-inquiry-request.dto";
import { CreateInquiryRequestRowDto } from "../../dto/inquiry-request/request/create-inquiry-request.dto";
import { InsertInquiryRequestImageDto } from "../../dto/inquiry-request/request/insert-inquiry-request-image.dto";
import { InsertInquiryRequestVideoDto } from "../../dto/inquiry-request/request/insert-inquiry-request-video.dto";
import { SearchCreateInquiryResponseDto } from "../../dto/inquiry-response/request/search-create-inquiry-response.dto";
import { CreateInquiryResponseRowDto } from "../../dto/inquiry-response/request/create-inquiry-response.dto";
import { InsertInquiryResponseImageDto } from "../../dto/inquiry-response/request/insert-inquiry-response-image.dto";
import { InsertInquiryResponseVideoDto } from "../../dto/inquiry-response/request/insert-inquiry-response-video.dto";

@Injectable()
export class InquiryTransactionContext {
  constructor(
    private readonly inquiryService: InquiryService,
    private readonly inquiryEventMapSetter: InquiryEventMapSetter,
  ) {}

  public async createInquiryRequestContext(dto: SearchCreateInquiryRequestDto): Promise<void> {
    const { inquiryRequestImages, inquiryRequestVideos, body, product, clientUser } = dto;

    const createInquiryRequestRowDto: CreateInquiryRequestRowDto = {
      body,
      product,
      clientUser,
    };

    const inquiryRequest = await this.inquiryService.createInquiryRequest(createInquiryRequestRowDto);

    const insertInquiryRequestImageDto: InsertInquiryRequestImageDto = {
      inquiryRequestImages,
      inquiryRequest,
    };

    const insertInquiryRequestVideoDto: InsertInquiryRequestVideoDto = {
      inquiryRequestVideos,
      inquiryRequest,
    };

    this.inquiryEventMapSetter.setClientEventParam({
      product,
      inquiryRequest,
      clientUser,
    });

    await Promise.all([
      this.inquiryService.insertInquiryRequestImages(insertInquiryRequestImageDto),
      this.inquiryService.insertInquiryRequestVideos(insertInquiryRequestVideoDto),
    ]);
  }

  public async createInquiryResponseContext(dto: SearchCreateInquiryResponseDto): Promise<void> {
    const { inquiryRequest, body, inquiryResponseImages, inquiryResponseVideos, inquiryRequester, inquiryRespondent } =
      dto;

    const createInquiryResponseRowDto: CreateInquiryResponseRowDto = {
      body,
      adminUser: inquiryRespondent,
      inquiryRequest,
    };

    const inquiryResponse = await this.inquiryService.createInquiryResponse(createInquiryResponseRowDto);

    await this.inquiryService.modifyInquiryRequestAnswerState(inquiryRequest.id);

    const insertInquiryResponseImageDto: InsertInquiryResponseImageDto = {
      inquiryResponseImages,
      inquiryResponse,
    };

    const insertInquiryResponseVideoDto: InsertInquiryResponseVideoDto = {
      inquiryResponseVideos,
      inquiryResponse,
    };

    this.inquiryEventMapSetter.setAdminEventParam({
      inquiryRequester,
      inquiryRequest,
      inquiryResponse,
    });

    await Promise.all([
      this.inquiryService.insertInquiryResponseImages(insertInquiryResponseImageDto),
      this.inquiryService.insertInquiryResponseVideos(insertInquiryResponseVideoDto),
    ]);
  }
}
