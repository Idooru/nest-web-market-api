import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { InquiryResponseDto } from "./inquiry-response.dto";

export class CreateInquiryResponseDto {
  inquiryRequestId: string;
  clientUserId: string;
  inquiryResponseDto: InquiryResponseDto;
  jwtPayload: JwtAccessTokenPayload;
}
