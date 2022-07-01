import { Injectable } from "@nestjs/common";
import { JwtPayload } from "src/common/interfaces/jwt-payload.interface";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";

@Injectable()
export class ReviewService {
  async createReview(
    createReviewDto: CreateReviewDto,
    jwtPayload: JwtPayload,
    image?: string[],
    video?: string[],
  ): Promise<any> {
    return "This action adds a new review";
  }

  findAll() {
    return `This action returns all review`;
  }

  findOne(id: number) {
    return `This action returns a #${id} review`;
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
