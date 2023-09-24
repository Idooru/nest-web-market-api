import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { AdminUserEntity } from "src/model/user/entities/admin-user.entity";
import { MediaCookieDto } from "src/model/media/dto/media-cookie.dto";
import { ProductBodyDto } from "./product-body.dto";

export class CreateProductDto {
  productBodyDto: ProductBodyDto;
  jwtPayload?: JwtAccessTokenPayload;
  productImgCookies?: MediaCookieDto[];
  admin?: AdminUserEntity;
}
