import { UserRepository } from "./../../user/user.repository";
import { ReviewRepository } from "./../review.repository";
import { Injectable } from "@nestjs/common";
import { CreateReviewVo } from "../dto/create-review.dto";
import { UpdateReviewDto } from "../dto/update-review.dto";

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async createReview(createReviewDao: CreateReviewVo): Promise<any> {
    const { createReviewDto, jwtPayload, reviewImg, reviewVdo } =
      createReviewDao;
    const { comments, rating } = createReviewDto;
    const { nickname } = jwtPayload;

    const user = await this.userRepository.findUserWithNickName(nickname);

    if (reviewImg || reviewVdo) {
      1;
    }
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
