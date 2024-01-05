import { Injectable } from "@nestjs/common";
import { InquirySearcher } from "../inquiry.searcher";
import { MediaSearcher } from "../../../media/logic/media.searcher";
import { InquiryUtils } from "../inquiry.utils";
import { PrepareToCreateInquiryRequestDto } from "../../dto/request/create-inquiry-request.dto";
import { SearchCreateInquiryRequestDto } from "../../dto/request/search-create-inquiry-request.dto";
import { PrepareToCreateInquiryResponseDto } from "../../dto/response/create-inquiry-response.dto";
import { SearchCreateInquiryResponseDto } from "../../dto/response/search-create-inquiry-response.dto";

@Injectable()
export class InquiryTransactionSearcher {
  constructor(
    private readonly inquirySearcher: InquirySearcher,
    private readonly mediaSearcher: MediaSearcher,
    private readonly inquiryUtils: InquiryUtils,
  ) {}

  public async searchToCreateInquiryRequest(
    dto: PrepareToCreateInquiryRequestDto,
  ): Promise<SearchCreateInquiryRequestDto> {
    const {
      inquiryRequestBodyDto,
      userId,
      productId,
      inquiryRequestImgCookies,
      inquiryRequestVdoCookies,
    } = dto;

    const [product, clientUser] = await this.inquiryUtils.getProductAndClient(
      productId,
      userId,
    );

    const [inquiryRequestImages, inquiryRequestVideos] = await Promise.all([
      this.mediaSearcher.findInquiryRequestImagesWithId(
        inquiryRequestImgCookies,
      ),
      this.mediaSearcher.findInquiryRequestVideosWithId(
        inquiryRequestVdoCookies,
      ),
    ]);

    return {
      inquiryRequestBodyDto,
      product,
      clientUser,
      inquiryRequestImages,
      inquiryRequestVideos,
    };
  }

  public async searchToCreateInquiryResponse(
    dto: PrepareToCreateInquiryResponseDto,
  ): Promise<SearchCreateInquiryResponseDto> {
    const {
      inquiryResponseBodyDto,
      inquiryRequesterId,
      inquiryRequestId,
      inquiryResponserId,
      inquiryResponseImgCookies,
      inquiryResponseVdoCookies,
    } = dto;

    const [inquiryResponseImages, inquiryResponseVideos] = await Promise.all([
      this.mediaSearcher.findInquiryResponseImagesWithId(
        inquiryResponseImgCookies,
      ),
      this.mediaSearcher.findInquiryResponseVideosWithId(
        inquiryResponseVdoCookies,
      ),
    ]);

    const [inquiryRequester, inquiryResponser] =
      await this.inquiryUtils.getUsers(inquiryRequesterId, inquiryResponserId);

    const inquiryRequest = await this.inquirySearcher.findInquiryRequestWithId(
      inquiryRequestId,
    );

    return {
      inquiryResponseBodyDto,
      inquiryResponseImages,
      inquiryResponseVideos,
      inquiryRequester,
      inquiryResponser,
      inquiryRequest,
    };
  }
}
