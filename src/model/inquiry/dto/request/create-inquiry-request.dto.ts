import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { ProductEntity } from "src/model/product/entities/product.entity";
import { ClientUserEntity } from "src/model/user/entities/client-user.entity";
import { InquiryRequestDto } from "./inquiry-request.dto";

export class CreateInquiryRequestDto {
  inquiryRequestDto: InquiryRequestDto;
  jwtPayload: JwtAccessTokenPayload;
  productId: string;
}

export class CreateInquiryRequestDao {
  inquiryRequestDto: InquiryRequestDto;
  client: ClientUserEntity;
  product: ProductEntity;
}
