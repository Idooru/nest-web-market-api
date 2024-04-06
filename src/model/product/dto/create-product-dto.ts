import { AdminUserEntity } from "src/model/user/entities/admin-user.entity";
import { MediaCookieDto } from "src/model/media/dto/media-cookie.dto";
import { ProductBodyDto } from "./product-body.dto";

export class CreateProductDto {
  public productBodyDto: ProductBodyDto;
  public userId?: string;
  public productImgCookies?: MediaCookieDto[];
  public admin?: AdminUserEntity;
}
