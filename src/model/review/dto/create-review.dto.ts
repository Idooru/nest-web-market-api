import { ProductEntity } from "src/model/product/entities/product.entity";
import { ClientUserEntity } from "src/model/user/entities/client-user.entity";
import { ReviewBodyDto } from "./review-body.dto";
import { MediaCookieDto } from "../../media/dto/media-cookie.dto";

export class PrepareToCreateReviewDto {
  reviewBodyDto: ReviewBodyDto;
  userId: string;
  productId: string;
  reviewImgCookies: MediaCookieDto[];
  reviewVdoCookies: MediaCookieDto[];
}

export class CreateReviewDto {
  reviewBodyDto: ReviewBodyDto;
  client: ClientUserEntity;
  product: ProductEntity;
}
