import { CreateReviewDto } from "../dto/create-review.dto";
import { ReviewGeneralRepository } from "../repositories/review-general.repository";
import { HttpStatus, Injectable } from "@nestjs/common";
import { ModifyReviewDto } from "../dto/modify-review.dto";
import { ReviewEntity } from "../entities/review.entity";
import { ProductGeneralRepository } from "src/model/product/repositories/product-general.repository";
import { UserGeneralRepository } from "src/model/user/repositories/user-general.repository";
import { ReviewInsertRepository } from "../repositories/review-insert.repository";
import { IReviewGeneralService } from "../interfaces/services/review-general-service.interface";
import { HttpExceptionHandlingBuilder } from "src/common/lib/error-handler/http-exception-handling.builder";
import { ErrorHandlerProps } from "src/common/classes/abstract/error-handler-props";

@Injectable()
export class ReviewGeneralService
  extends ErrorHandlerProps
  implements IReviewGeneralService
{
  constructor(
    private readonly reviewGeneralRepository: ReviewGeneralRepository,
    private readonly productGeneralRepository: ProductGeneralRepository,
    private readonly userGeneralRepository: UserGeneralRepository,
    private readonly reviewInsertRepository: ReviewInsertRepository,
    private readonly httpExceptionHandlingBuilder: HttpExceptionHandlingBuilder,
  ) {
    super();
  }

  async findReviewByProductId(id: string): Promise<ReviewEntity[]> {
    const product = await this.productGeneralRepository.findOneProductById(id);

    if (!product.Review.length) {
      this.methodName = this.findReviewByProductId.name;
      this.httpExceptionHandlingBuilder
        .setMessage("해당 상품에 리뷰가 존재하지 않습니다.")
        .setOccuredLocation("class")
        .setOccuredClass(this.className, this.methodName)
        .setExceptionStatus(HttpStatus.NOT_FOUND)
        .handle();
    }

    return product.Review;
  }

  async createReview(createReviewDto: CreateReviewDto): Promise<ReviewEntity> {
    const { reviewRequestDto, jwtPayload, productId } = createReviewDto;

    const [product, client] = await Promise.all([
      this.productGeneralRepository.findOneProductById(productId),
      this.userGeneralRepository.findClientUserObjectWithId(jwtPayload.userId),
    ]);

    const reviewOutput = await this.reviewGeneralRepository.createReview({
      reviewRequestDto,
      client,
      product,
    });

    const reviewId = reviewOutput.generatedMaps[0].id;

    const review = await this.reviewInsertRepository.findOneReviewById(
      reviewId,
    );

    await this.reviewInsertRepository.insertReviewIdOnClientUser(
      client,
      review,
    );

    return review;
  }

  async modifyReview(modifyReviewDto: ModifyReviewDto): Promise<void> {
    await this.reviewGeneralRepository.modifyReview(modifyReviewDto);
  }

  async deleteReview(review: ReviewEntity): Promise<void> {
    await this.reviewGeneralRepository.deleteReview(review);
  }
}
