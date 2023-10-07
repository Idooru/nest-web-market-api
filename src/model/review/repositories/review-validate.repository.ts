import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ReviewEntity } from "../entities/review.entity";
import { Repository } from "typeorm";

@Injectable()
export class ReviewValidateRepository {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
  ) {}

  public async isExistId(id: string): Promise<boolean> {
    return await this.reviewRepository.exist({ where: { id } });
  }
}
