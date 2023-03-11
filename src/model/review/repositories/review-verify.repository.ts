import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ReviewEntity } from "../entities/review.entity";

@Injectable()
export class ReviewVerifyRepository {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
  ) {}

  private readonly logger = new Logger("Repository");

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
