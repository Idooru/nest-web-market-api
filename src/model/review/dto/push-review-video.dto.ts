import { RequestMediaDto } from "src/model/media/dto/request-media.dto";

export class PushReviewVideoDto {
  reviewRequestDto: ReviewRequestDto;
  reviewVdoCookies: RequestMediaDto[];
}
