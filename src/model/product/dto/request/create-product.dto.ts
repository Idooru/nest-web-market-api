import { AdminUserEntity } from "src/model/user/entities/admin-user.entity";
import { ProductBody } from "./product-body.dto";
import { MediaCookieDto } from "../../../media/dto/request/media-cookie.dto";

export class CreateProductDto {
  public body: ProductBody;
  public userId?: string;
  public productImgCookies?: MediaCookieDto[];
  public admin?: AdminUserEntity;
}
