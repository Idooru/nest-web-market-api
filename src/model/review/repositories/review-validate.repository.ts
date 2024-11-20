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

  public validateId(id: string): Promise<boolean> {
    return this.reviewRepository.exist({ where: { id } });
  }
}
