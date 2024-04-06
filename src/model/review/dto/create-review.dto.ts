import { ProductEntity } from "src/model/product/entities/product.entity";
import { ClientUserEntity } from "src/model/user/entities/client-user.entity";
import { ReviewBodyDto } from "./review-body.dto";
import { MediaCookieDto } from "../../media/dto/media-cookie.dto";

export class PrepareToCreateReviewDto {
  public reviewBodyDto: ReviewBodyDto;
  public userId: string;
  public productId: string;
  public reviewImgCookies: MediaCookieDto[];
  public reviewVdoCookies: MediaCookieDto[];
}

export class CreateReviewDto {
  public reviewBodyDto: ReviewBodyDto;
  public clientUser: ClientUserEntity;
  public product: ProductEntity;
}
