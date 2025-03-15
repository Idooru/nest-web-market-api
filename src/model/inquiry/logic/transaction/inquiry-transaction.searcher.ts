import { Injectable } from "@nestjs/common";
import { InquirySearcher } from "../inquiry.searcher";
import { MediaSearcher } from "../../../media/logic/media.searcher";
import { InquiryUtils } from "../inquiry.utils";
import { CreateInquiryRequestDto } from "../../dto/request/create-inquiry-request.dto";
import { SearchCreateInquiryRequestDto } from "../../dto/request/search-create-inquiry-request.dto";
import { CreateInquiryResponseDto } from "../../dto/response/create-inquiry-response.dto";
import { SearchCreateInquiryResponseDto } from "../../dto/response/search-create-inquiry-response.dto";

@Injectable()
export class InquiryTransactionSearcher {
  constructor(
    private readonly inquirySearcher: InquirySearcher,
    private readonly mediaSearcher: MediaSearcher,
    private readonly inquiryUtils: InquiryUtils,
  ) {}

  public async searchCreateInquiryRequest(dto: CreateInquiryRequestDto): Promise<SearchCreateInquiryRequestDto> {
    const { body, userId, productId, imageCookies, videoCookies } = dto;

    const [product, clientUser] = await this.inquiryUtils.getProductAndClient(productId, userId);

    const [inquiryRequestImages, inquiryRequestVideos] = await Promise.all([
      this.mediaSearcher.findInquiryRequestImagesWithId(imageCookies),
      this.mediaSearcher.findInquiryRequestVideosWithId(videoCookies),
    ]);

    return {
      body,
      product,
      clientUser,
      inquiryRequestImages,
      inquiryRequestVideos,
    };
  }

  public async searchToCreateInquiryResponse(dto: CreateInquiryResponseDto): Promise<SearchCreateInquiryResponseDto> {
    const { body, inquiryRequesterId, inquiryRequestId, inquiryRespondentId, imageCookies, videoCookies } = dto;

    const [inquiryResponseImages, inquiryResponseVideos] = await Promise.all([
      this.mediaSearcher.findInquiryResponseImagesWithId(imageCookies),
      this.mediaSearcher.findInquiryResponseVideosWithId(videoCookies),
    ]);

    const [inquiryRequester, inquiryRespondent] = await this.inquiryUtils.getUsers(
      inquiryRequesterId,
      inquiryRespondentId,
    );

    const inquiryRequest = await this.inquirySearcher.findInquiryRequest(inquiryRequestId);

    return {
      body,
      inquiryResponseImages,
      inquiryResponseVideos,
      inquiryRequester,
      inquiryRespondent,
      inquiryRequest,
    };
  }
}
