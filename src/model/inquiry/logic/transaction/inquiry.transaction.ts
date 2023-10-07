import { Injectable } from "@nestjs/common";
import { InquiryQueryRunnerProvider } from "./inquiry-query-runner.provider";
import { InquirySearcher } from "../inquiry.searcher";
import { MediaSearcher } from "../../../media/logic/media.searcher";
import { ProductSearcher } from "../../../product/logic/product.searcher";
import { InquiryOperationService } from "../../services/inquiry-operation.service";
import { InquiryFunctionService } from "../../services/inquiry-function.service";
import { InquiryUtils } from "../inquiry.utils";
import {
  CreateInquiryRequestAllMediaDto,
  CreateInquiryRequestNoMediaDto,
  CreateInquiryRequestWithImageDto,
  CreateInquiryRequestWithVideoDto,
} from "../../dto/request/create-inquiry-request.dto";
import {
  CreateInquiryResponseAllMediaDto,
  CreateInquiryResponseNoMediaDto,
  CreateInquiryResponseWithImageDto,
  CreateInquiryResponseWithVideoDto,
} from "../../dto/response/create-inquiry-response.dto";
import { loggerFactory } from "../../../../common/functions/logger.factory";
import { TypeOrmException } from "../../../../common/errors/typeorm.exception";

@Injectable()
export class InquiryTransaction {
  constructor(
    private readonly inquiryQueryRunnerProvider: InquiryQueryRunnerProvider,
    private readonly inquirySearcher: InquirySearcher,
    private readonly mediaSearcher: MediaSearcher,
    private readonly productSearcher: ProductSearcher,
    private readonly inquiryOperationService: InquiryOperationService,
    private readonly inquiryFunctionService: InquiryFunctionService,
    private readonly inquiryUtils: InquiryUtils,
  ) {}

  public async createInquiryRequestAllMedias(
    inquiryRequestAllMediaDto: CreateInquiryRequestAllMediaDto,
  ): Promise<void> {
    const {
      inquiryRequestBodyDto,
      userId,
      productId,
      inquiryRequestImgCookies,
      inquiryRequestVdoCookies,
    } = inquiryRequestAllMediaDto;

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

    const queryRunner = await this.inquiryQueryRunnerProvider.init();

    try {
      const inquiryRequest =
        await this.inquiryOperationService.createInquiryRequest({
          inquiryRequestBodyDto,
          product,
          client,
        });

      const imageWork =
        this.inquiryFunctionService.getInsertInquiryRequestImagesFunc({
          inquiryRequestImages,
          inquiryRequest,
        });

      const videoWork =
        this.inquiryFunctionService.getInsertInquiryRequestVideosFunc({
          inquiryRequestVideos,
          inquiryRequest,
        });

      const mailWork =
        this.inquiryFunctionService.getSendMailToAdminAboutInquiryRequestFunc({
          product,
          inquiryRequest,
          client,
        });

      await Promise.all([imageWork(), videoWork(), mailWork()]);
      await queryRunner.commitTransaction();
    } catch (err) {
      loggerFactory("Transaction").error(err);
      await queryRunner.rollbackTransaction();
      throw new TypeOrmException(err);
    } finally {
      await queryRunner.release();
    }
  }

  public async createInquiryRequestWithImages(
    inquiryRequestWithImageDto: CreateInquiryRequestWithImageDto,
  ) {
    const {
      inquiryRequestBodyDto,
      userId,
      productId,
      inquiryRequestImgCookies,
    } = inquiryRequestWithImageDto;

    const [product, client] = await this.inquiryUtils.getProductAndClient(
      productId,
      userId,
    );

    const inquiryRequestImages =
      await this.mediaSearcher.findInquiryRequestImagesWithId(
        inquiryRequestImgCookies,
      );

    const queryRunner = await this.inquiryQueryRunnerProvider.init();

    try {
      const inquiryRequest =
        await this.inquiryOperationService.createInquiryRequest({
          inquiryRequestBodyDto,
          product,
          client,
        });

      const imageWork =
        this.inquiryFunctionService.getInsertInquiryRequestImagesFunc({
          inquiryRequestImages,
          inquiryRequest,
        });

      const emailWork =
        this.inquiryFunctionService.getSendMailToAdminAboutInquiryRequestFunc({
          product,
          inquiryRequest,
          client,
        });

      await Promise.all([imageWork(), emailWork()]);
      await queryRunner.commitTransaction();
    } catch (err) {
      loggerFactory("Transaction").error(err);
      await queryRunner.rollbackTransaction();
      throw new TypeOrmException(err);
    } finally {
      await queryRunner.release();
    }
  }

  public async createInquiryRequestWithVideos(
    inquiryRequestWithVideoDto: CreateInquiryRequestWithVideoDto,
  ) {
    const {
      inquiryRequestBodyDto,
      userId,
      productId,
      inquiryRequestVdoCookies,
    } = inquiryRequestWithVideoDto;

    const [product, client] = await this.inquiryUtils.getProductAndClient(
      productId,
      userId,
    );

    const inquiryRequestVideos =
      await this.mediaSearcher.findInquiryRequestVideosWithId(
        inquiryRequestVdoCookies,
      );

    const queryRunner = await this.inquiryQueryRunnerProvider.init();

    try {
      const inquiryRequest =
        await this.inquiryOperationService.createInquiryRequest({
          inquiryRequestBodyDto,
          product,
          client,
        });

      const videoWork =
        this.inquiryFunctionService.getInsertInquiryRequestVideosFunc({
          inquiryRequestVideos,
          inquiryRequest,
        });

      const emailWork =
        this.inquiryFunctionService.getSendMailToAdminAboutInquiryRequestFunc({
          product,
          inquiryRequest,
          client,
        });

      await Promise.all([videoWork(), emailWork()]);
      await queryRunner.commitTransaction();
    } catch (err) {
      loggerFactory("Transaction").error(err);
      await queryRunner.rollbackTransaction();
      throw new TypeOrmException(err);
    } finally {
      await queryRunner.release();
    }
  }

  public async createInquiryRequestNoMedia(
    inquiryRequestNoMediaDto: CreateInquiryRequestNoMediaDto,
  ) {
    const { inquiryRequestBodyDto, userId, productId } =
      inquiryRequestNoMediaDto;

    const [product, client] = await this.inquiryUtils.getProductAndClient(
      productId,
      userId,
    );

    const queryRunner = await this.inquiryQueryRunnerProvider.init();

    try {
      const inquiryRequest =
        await this.inquiryOperationService.createInquiryRequest({
          inquiryRequestBodyDto,
          product,
          client,
        });

      const emailWork =
        this.inquiryFunctionService.getSendMailToAdminAboutInquiryRequestFunc({
          product,
          inquiryRequest,
          client,
        });

      await emailWork();
      await queryRunner.commitTransaction();
    } catch (err) {
      loggerFactory("Transaction").error(err);
      await queryRunner.rollbackTransaction();
      throw new TypeOrmException(err);
    } finally {
      await queryRunner.release();
    }
  }

  public async createInquiryResponseAllMedias(
    inquiryResponseAllMediaDto: CreateInquiryResponseAllMediaDto,
  ) {
    const {
      inquiryResponseBodyDto,
      inquiryRequestId,
      inquiryRequesterId,
      inquiryResponserId,
      inquiryResponseImgCookies,
      inquiryResponseVdoCookies,
    } = inquiryResponseAllMediaDto;

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

    const queryRunner = await this.inquiryQueryRunnerProvider.init();

    try {
      const inquiryResponse =
        await this.inquiryOperationService.createInquiryResponse({
          inquiryResponseBodyDto,
          admin: inquiryResponser,
          inquiryRequest,
        });

      const imageWork =
        this.inquiryFunctionService.getInsertInquiryResponseImagesFunc({
          inquiryResponseImages,
          inquiryResponse,
        });

      const videoWork =
        this.inquiryFunctionService.getInsertInquiryResponseVideosFunc({
          inquiryResponseVideos,
          inquiryResponse,
        });

      const emailWork =
        this.inquiryFunctionService.getSendMailToClientAboutInquiryResponseFunc(
          { inquiryRequester, inquiryRequest, inquiryResponse },
        );

      await Promise.all([imageWork(), videoWork(), emailWork()]);
      await queryRunner.commitTransaction();
    } catch (err) {
      loggerFactory("Transaction").error(err);
      await queryRunner.rollbackTransaction();
      throw new TypeOrmException(err);
    } finally {
      await queryRunner.release();
    }
  }

  public async createInquiryResponseWithImages(
    inquiryResponseWithImageDto: CreateInquiryResponseWithImageDto,
  ) {
    const {
      inquiryResponseBodyDto,
      inquiryRequestId,
      inquiryRequesterId,
      inquiryResponserId,
      inquiryResponseImgCookies,
    } = inquiryResponseWithImageDto;

    const [inquiryRequester, inquiryResponser] =
      await this.inquiryUtils.getUsers(inquiryRequesterId, inquiryResponserId);

    const inquiryRequest = await this.inquirySearcher.findInquiryRequestWithId(
      inquiryRequestId,
    );

    const inquiryResponseImages =
      await this.mediaSearcher.findInquiryResponseImagesWithId(
        inquiryResponseImgCookies,
      );

    const queryRunner = await this.inquiryQueryRunnerProvider.init();

    try {
      const inquiryResponse =
        await this.inquiryOperationService.createInquiryResponse({
          inquiryResponseBodyDto,
          admin: inquiryResponser,
          inquiryRequest,
        });

      const imageWork =
        this.inquiryFunctionService.getInsertInquiryResponseImagesFunc({
          inquiryResponseImages,
          inquiryResponse,
        });

      const emailWork =
        this.inquiryFunctionService.getSendMailToClientAboutInquiryResponseFunc(
          { inquiryRequester, inquiryRequest, inquiryResponse },
        );

      await Promise.all([imageWork(), emailWork()]);

      await queryRunner.commitTransaction();
    } catch (err) {
      loggerFactory("Transaction").error(err);
      await queryRunner.rollbackTransaction();
      throw new TypeOrmException(err);
    } finally {
      await queryRunner.release();
    }
  }

  public async createInquiryResponseWithVideos(
    inquiryResponseWithVideoDto: CreateInquiryResponseWithVideoDto,
  ) {
    const {
      inquiryResponseBodyDto,
      inquiryRequestId,
      inquiryRequesterId,
      inquiryResponserId,
      inquiryResponseVdoCookies,
    } = inquiryResponseWithVideoDto;

    const inquiryResponseVideos =
      await this.mediaSearcher.findInquiryResponseVideosWithId(
        inquiryResponseVdoCookies,
      );

    const [inquiryRequester, inquiryResponser] =
      await this.inquiryUtils.getUsers(inquiryRequesterId, inquiryResponserId);

    const inquiryRequest = await this.inquirySearcher.findInquiryRequestWithId(
      inquiryRequestId,
    );

    const queryRunner = await this.inquiryQueryRunnerProvider.init();

    try {
      const inquiryResponse =
        await this.inquiryOperationService.createInquiryResponse({
          inquiryResponseBodyDto,
          admin: inquiryResponser,
          inquiryRequest,
        });

      const videoWork =
        this.inquiryFunctionService.getInsertInquiryResponseVideosFunc({
          inquiryResponseVideos,
          inquiryResponse,
        });

      const emailWork =
        this.inquiryFunctionService.getSendMailToClientAboutInquiryResponseFunc(
          { inquiryRequester, inquiryRequest, inquiryResponse },
        );

      await Promise.all([videoWork(), emailWork()]);
      await queryRunner.commitTransaction();
    } catch (err) {
      loggerFactory("Transaction").error(err);
      await queryRunner.rollbackTransaction();
      throw new TypeOrmException(err);
    } finally {
      await queryRunner.release();
    }
  }

  public async createInquiryResponseNoMedia(
    inquiryResponseNoMediaDto: CreateInquiryResponseNoMediaDto,
  ) {
    const {
      inquiryResponseBodyDto,
      inquiryRequestId,
      inquiryRequesterId,
      inquiryResponserId,
    } = inquiryResponseNoMediaDto;

    const [inquiryRequester, inquiryResponser] =
      await this.inquiryUtils.getUsers(inquiryRequesterId, inquiryResponserId);

    const inquiryRequest = await this.inquirySearcher.findInquiryRequestWithId(
      inquiryRequestId,
    );

    const queryRunner = await this.inquiryQueryRunnerProvider.init();

    try {
      const inquiryResponse =
        await this.inquiryOperationService.createInquiryResponse({
          inquiryResponseBodyDto,
          admin: inquiryResponser,
          inquiryRequest,
        });

      const emailWork =
        this.inquiryFunctionService.getSendMailToClientAboutInquiryResponseFunc(
          { inquiryRequester, inquiryRequest, inquiryResponse },
        );

      await emailWork();
      await queryRunner.commitTransaction();
    } catch (err) {
      loggerFactory("Transaction").error(err);
      await queryRunner.rollbackTransaction();
      throw new TypeOrmException(err);
    } finally {
      await queryRunner.release();
    }
  }
}