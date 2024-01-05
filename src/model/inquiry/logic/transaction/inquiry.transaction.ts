import { Injectable } from "@nestjs/common";
import { InquirySearcher } from "../inquiry.searcher";
import { MediaSearcher } from "../../../media/logic/media.searcher";
import { InquiryUpdateService } from "../../services/inquiry-update.service";
import { InquiryFactoryService } from "../../services/inquiry-factory.service";
import { InquiryUtils } from "../inquiry.utils";
import { PrepareToCreateInquiryRequestDto } from "../../dto/request/create-inquiry-request.dto";
import { PrepareToCreateInquiryResponseDto } from "../../dto/response/create-inquiry-response.dto";
import { TransactionErrorHandler } from "../../../../common/lib/transaction/transaction-error.handler";
import { InquiryEventMapSetter } from "../inquiry-event-map.setter";
import { InquiryRepositoryPayload } from "./inquiry-repository.payload";
import { Transactional } from "../../../../common/interfaces/initializer/transactional";

@Injectable()
export class InquiryTransaction {
  constructor(
    private readonly transaction: Transactional<InquiryRepositoryPayload>,
    private readonly inquirySearcher: InquirySearcher,
    private readonly mediaSearcher: MediaSearcher,
    private readonly inquiryUpdateService: InquiryUpdateService,
    private readonly inquiryFactoryService: InquiryFactoryService,
    private readonly inquiryUtils: InquiryUtils,
    private readonly transactionErrorHandler: TransactionErrorHandler,
    private readonly inquiryEventMapSetter: InquiryEventMapSetter,
  ) {}

  public async createInquiryRequest(
    prepareToCreateInquiryRequestDto: PrepareToCreateInquiryRequestDto,
  ): Promise<void> {
    const {
      inquiryRequestBodyDto,
      userId,
      productId,
      inquiryRequestImgCookies,
      inquiryRequestVdoCookies,
    } = prepareToCreateInquiryRequestDto;

    const [product, client] = await this.inquiryUtils.getProductAndClient(
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

    const queryRunner = await this.transaction.init();

    try {
      const inquiryRequest =
        await this.inquiryUpdateService.createInquiryRequest({
          inquiryRequestBodyDto,
          product,
          client,
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
        client,
      });

      await Promise.all([imageWork(), videoWork()]);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.transactionErrorHandler.handle(err);
    } finally {
      await queryRunner.release();
    }
  }

  public async createInquiryResponse(
    prepareToCreateInquiryResponseDto: PrepareToCreateInquiryResponseDto,
  ): Promise<void> {
    const {
      inquiryResponseBodyDto,
      inquiryRequestId,
      inquiryRequesterId,
      inquiryResponserId,
      inquiryResponseImgCookies,
      inquiryResponseVdoCookies,
    } = prepareToCreateInquiryResponseDto;

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

    const queryRunner = await this.transaction.init();

    try {
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
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.transactionErrorHandler.handle(err);
    } finally {
      await queryRunner.release();
    }
  }
}
