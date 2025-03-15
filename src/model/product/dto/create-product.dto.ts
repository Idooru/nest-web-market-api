import { AdminUserEntity } from "src/model/user/entities/admin-user.entity";
import { MediaCookieDto } from "src/model/media/dto/media-cookie.dto";
import { ProductBody } from "./product-body.dto";

export class CreateProductDto {
  public body: ProductBody;
  public userId?: string;
  public productImgCookies?: MediaCookieDto[];
  public admin?: AdminUserEntity;
}
