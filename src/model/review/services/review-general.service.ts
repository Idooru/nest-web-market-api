import {
  CreateReviewWithoutMediaDto,
  CreateReviewWithImageDto,
  CreateReviewWithVideoDto,
} from "../dto/create-review.dto";
import { ReviewGeneralRepository } from "../repositories/review-general.repository";
import { Injectable } from "@nestjs/common";
import {
  ModifyReviewDao,
  ModifyReviewWithImageDto,
  ModifyReviewWithVideoDto,
} from "../dto/modify-review.dto";
import { ReviewEntity } from "../entities/review.entity";
import { ProductGeneralRepository } from "src/model/product/repositories/product-general.repository";
import { UserGeneralRepository } from "src/model/user/repositories/user-general.repository";
import { ReviewInsertRepository } from "../repositories/review-insert.repository";
import { ReviewRedundantService } from "./review-redundant.service";

@Injectable()
export class ReviewGeneralService {
  constructor(
    private readonly reviewGeneralRepository: ReviewGeneralRepository,
    private readonly productGeneralRepository: ProductGeneralRepository,
    private readonly userGeneralRepository: UserGeneralRepository,
    private readonly reviewInsertRepository: ReviewInsertRepository,
    private readonly reviewRedundantService: ReviewRedundantService,
  ) {}

  async createReviewWithImage(
    createRevieWithImageDto: CreateReviewWithImageDto,
  ): Promise<void> {
    const { createReviewDto, jwtPayload, productId, reviewImgCookies } =
      createRevieWithImageDto;

    const [product, client] = await Promise.all([
      this.productGeneralRepository.findProductOneById(productId),
      this.userGeneralRepository.findClientUserObject(jwtPayload.userId),
    ]);
    createReviewDto.Image = [];

    this.reviewRedundantService.distinguishReviewImagesCountForPush(
      reviewImgCookies,
      createReviewDto,
    );
    await this.reviewGeneralRepository.createReview({
      createReviewDto,
      client,
      product,
    });

    const review = await this.reviewInsertRepository.findLastCreatedReview();
    await this.reviewGeneralRepository.insertReviewIdOnClientUser(
      client,
      review,
    );

    this.reviewRedundantService.distinguishReviewImagesCountForInsert(
      reviewImgCookies,
      createReviewDto,
      review,
    );
  }

  async createReviewWithVideo(
    createReviewWithVideoDto: CreateReviewWithVideoDto,
  ): Promise<void> {
    const { createReviewDto, jwtPayload, productId, reviewVdoCookies } =
      createReviewWithVideoDto;

    const [product, client] = await Promise.all([
      this.productGeneralRepository.findProductOneById(productId),
      this.userGeneralRepository.findClientUserObject(jwtPayload.userId),
    ]);
    createReviewDto.Video = [];

    this.reviewRedundantService.distinguishReviewVideosCountForPush(
      reviewVdoCookies,
      createReviewDto,
    );
    await this.reviewGeneralRepository.createReview({
      createReviewDto,
      client,
      product,
    });

    const review = await this.reviewInsertRepository.findLastCreatedReview();
    await this.reviewGeneralRepository.insertReviewIdOnClientUser(
      client,
      review,
    );

    this.reviewRedundantService.distinguishReviewVideosCountForInsert(
      reviewVdoCookies,
      createReviewDto,
      review,
    );
  }

  async createReviewWithoutMedia(
    createReviewWithOutMediaDto: CreateReviewWithoutMediaDto,
  ): Promise<void> {
    const { createReviewDto, jwtPayload, productId } =
      createReviewWithOutMediaDto;

    const [product, client] = await Promise.all([
      this.productGeneralRepository.findProductOneById(productId),
      this.userGeneralRepository.findClientUserObject(jwtPayload.userId),
    ]);

    await this.reviewGeneralRepository.createReview({
      createReviewDto,
      client,
      product,
    });

    const review = await this.reviewInsertRepository.findLastCreatedReview();
    await this.reviewGeneralRepository.insertReviewIdOnClientUser(
      client,
      review,
    );
  }

  async modifyReviewWithImage(
    modifyReviewWithImageDto: ModifyReviewWithImageDto,
  ): Promise<void> {
    const { modifyReviewDto, review, reviewImgCookies } =
      modifyReviewWithImageDto;

    await this.reviewGeneralRepository.modifyReview({
      modifyReviewDto,
      review,
    });

    modifyReviewDto.Image = [];

    this.reviewRedundantService.distinguishReviewImagesCountForModify(
      reviewImgCookies,
      modifyReviewDto,
      review,
    );
  }

  async modifyReviewWithVideo(
    modifyReviewWithVideoDto: ModifyReviewWithVideoDto,
  ): Promise<void> {
    const { modifyReviewDto, review, reviewVdoCookies } =
      modifyReviewWithVideoDto;

    await this.reviewGeneralRepository.modifyReview({
      modifyReviewDto,
      review,
    });

    modifyReviewDto.Video = [];

    this.reviewRedundantService.distinguishReviewVideosCountForModify(
      reviewVdoCookies,
      modifyReviewDto,
      review,
    );
  }

  async modifyReviewWithoutMedia(
    modifyReviewDao: ModifyReviewDao,
  ): Promise<void> {
    const { review } = modifyReviewDao;

    if (review.Image.length >= 1) {
      await this.reviewRedundantService.distinguishReviewImagesCountForDelete(
        review.Image,
        review,
      );
    } else if (review.Video.length >= 1) {
      await this.reviewRedundantService.distinguishReviewVideosCountForDelete(
        review.Video,
        review,
      );
    }

    await this.reviewGeneralRepository.modifyReview(modifyReviewDao);
  }

  async deleteReview(review: ReviewEntity): Promise<void> {
    await this.reviewGeneralRepository.deleteReview(review);
  }
}
