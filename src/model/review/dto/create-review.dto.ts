import { ProductEntity } from "src/model/product/entities/product.entity";
import { ClientUserEntity } from "src/model/user/entities/client-user.entity";
import { ReviewBodyDto } from "./review-body.dto";
import { MediaCookieDto } from "../../media/dto/media-cookie.dto";

class ReviewBasicDto {
  reviewBodyDto: ReviewBodyDto;
  userId: string;
  productId: string;
}

export class CreateReviewAllMediaDto extends ReviewBasicDto {
  reviewImgCookies: MediaCookieDto[];
  reviewVdoCookies: MediaCookieDto[];
}

export class CreateReviewImageDto extends ReviewBasicDto {
  reviewImgCookies: MediaCookieDto[];
}

export class CreateReviewVideoDto extends ReviewBasicDto {
  reviewVdoCookies: MediaCookieDto[];
}

export class CreateReviewNoMediaDto extends ReviewBasicDto {}

export class CreateReviewDto {
  reviewBodyDto: ReviewBodyDto;
  client: ClientUserEntity;
  product: ProductEntity;
}
