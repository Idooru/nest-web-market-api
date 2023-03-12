import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RepositoryLogger } from "src/common/classes/repository.logger";
import { Repository } from "typeorm";
import { ReviewEntity } from "../entities/review.entity";

@Injectable()
export class ReviewVerifyRepository extends RepositoryLogger {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
  ) {
    super();
  }

  async isExistReviewId(id: string): Promise<boolean> {
    try {
      const result = await this.reviewRepository.findOne({
        where: { id },
      });
      return result ? true : false;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }
}
