import { InjectRepository } from "@nestjs/typeorm";
import { ReviewEntity } from "../entities/review.entity";
import { Inject, Injectable } from "@nestjs/common";
import { Repository, SelectQueryBuilder } from "typeorm";
import { ReviewSelect } from "../../../common/config/repository-select-configs/review.select";
import { ReviewBasicRawDto } from "../dto/response/review-basic-raw.dto";
import { ReviewDetailRawDto } from "../dto/response/review-detail-raw.dto";
import {
  FindOptionalEntityArgs,
  FindPureEntityArgs,
  SearchRepository,
} from "../../../common/interfaces/search/search.repository";
import { Implemented } from "../../../common/decorators/implemented.decoration";
import { ReviewFromProductRawDto } from "../dto/response/review-from-product-raw.dto";
import { FindAllReviewsDto } from "../dto/request/find-all-reviews.dto";

@Injectable()
export class ReviewSearchRepository extends SearchRepository<ReviewEntity, FindAllReviewsDto, ReviewBasicRawDto> {
  constructor(
    @Inject("review-select")
    private readonly select: ReviewSelect,
    @Inject("review-id-filter")
    private readonly reviewIdFilter: string,
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
  ) {
    super();
  }

  private selectReview(selects?: string[]): SelectQueryBuilder<ReviewEntity> {
    const queryBuilder = this.reviewRepository.createQueryBuilder();
    if (selects && selects.length) {
      return queryBuilder.select(selects).from(ReviewEntity, "review");
    }
    return queryBuilder.select("review").from(ReviewEntity, "review");
  }

  @Implemented
  public async findPureEntity(args: FindPureEntityArgs): Promise<ReviewEntity | ReviewEntity[]> {
    const { property, alias, getOne } = args;
    const query = this.selectReview().where(property, alias);
    return super.getEntity(getOne, query);
  }

  @Implemented
  public async findOptionalEntity(args: FindOptionalEntityArgs): Promise<ReviewEntity | ReviewEntity[]> {
    const { property, alias, entities, getOne } = args;
    const query = this.selectReview().where(property, alias);
    super.joinEntity(entities, query, "review");
    return super.getEntity(getOne, query);
  }

  @Implemented
  public async findAllRaws(dto: FindAllReviewsDto): Promise<ReviewBasicRawDto[]> {
    const { align, column, userId } = dto;
    const reviews = await this.selectReview(this.select.reviews)
      .innerJoin("review.Product", "Product")
      .leftJoin("Product.ProductImage", "ProductImage")
      .innerJoin("review.ClientUser", "Client")
      .leftJoin("review.ReviewImage", "Image")
      .leftJoin("review.ReviewVideo", "Video")
      .orderBy(`review.${column}`, align)
      .where("Client.id = :id", { id: userId })
      .groupBy("review.id")
      .getRawMany();

    return reviews.map((review) => ({
      review: {
        id: review.reviewId,
        title: review.reviewTitle,
        createdAt: review.reviewCreatedAt,
        starRateScore: parseInt(review.starRateScore),
        countForModify: parseInt(review.countForModify),
      },
      product: {
        id: review.productId,
        name: review.productName,
        price: parseInt(review.productPrice),
        category: review.productCategory,
      },
    }));
  }

  public async findAllRawsWithProductId(id: string): Promise<ReviewFromProductRawDto[]> {
    const reviews = await this.selectReview(this.select.reviewWithProducts)
      .innerJoin("review.Product", "Product")
      .where("Product.id = :id", { id })
      .getRawMany();

    return reviews.map((review) => ({
      reviewId: review.reviewId,
      reviewTitle: review.reviewTitle,
      reviewContent: review.reviewContent,
      starRateScore: parseInt(review.starRateScore),
      countForModify: parseInt(review.countForModify),
    }));
  }

  public async findDetailRaw(id: string): Promise<ReviewDetailRawDto> {
    const reviewRaw = await this.selectReview(this.select.review)
      .innerJoin("review.Product", "Product")
      .leftJoin("Product.ProductImage", "ProductImage")
      .innerJoin("review.ClientUser", "Client")
      .leftJoin("review.ReviewImage", "ReviewImage")
      .leftJoin("review.ReviewVideo", "ReviewVideo")
      .where(this.reviewIdFilter, { id })
      .getRawMany();

    return {
      review: {
        id: reviewRaw[0].reviewerId,
        title: reviewRaw[0].reviewTitle,
        content: reviewRaw[0].reviewContent,
        starRateScore: parseInt(reviewRaw[0].starRateScore),
        countForModify: parseInt(reviewRaw[0].countForModify),
        imageUrls: [...new Set(reviewRaw.map((item) => item.reviewImageUrl).filter(Boolean))],
        videoUrls: [...new Set(reviewRaw.map((item) => item.reviewVideoUrl).filter(Boolean))],
      },
      product: {
        id: reviewRaw[0].productId,
        name: reviewRaw[0].productName,
        price: parseInt(reviewRaw[0].productPrice),
        category: reviewRaw[0].productCategory,
      },
    };
  }
}
