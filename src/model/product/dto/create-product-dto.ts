import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { ProductDto } from "./product.dto";
import { AdminUserEntity } from "src/model/user/entities/admin-user.entity";

export class CreateProductDto {
  productDto: ProductDto;
  jwtPayload: JwtAccessTokenPayload;
}

export class CreateProductDao {
  productDto: ProductDto;
  admin: AdminUserEntity;
}
