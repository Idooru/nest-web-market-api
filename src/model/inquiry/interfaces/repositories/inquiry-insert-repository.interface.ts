import { ClientUserEntity } from "src/model/user/entities/client-user.entity";
import { InquiryRequestEntity } from "../../entities/inquiry-request.entity";
import { InquiryResponseEntity } from "../../entities/inquiry-response.entity";
import { AdminUserEntity } from "src/model/user/entities/admin-user.entity";

export interface IInquiryInsertRepository {
  findOneInquiryRequestById(id: string): Promise<InquiryRequestEntity>;
  findOneInquiryResponseById(id: string): Promise<InquiryResponseEntity>;
  insertInquiryRequestIdOnInquiryResponse(
    inquiryRequest: InquiryRequestEntity,
    inquiryResponse: InquiryResponseEntity,
  ): Promise<void>;
  insertClientUserIdOnInquiryRequest(
    clientUser: ClientUserEntity,
    inquiryRequest: InquiryRequestEntity,
  ): Promise<void>;
  insertAdminUserIdOnInquiryResponse(
    adminUser: AdminUserEntity,
    inquiryResponse: InquiryResponseEntity,
  ): Promise<void>;
}
