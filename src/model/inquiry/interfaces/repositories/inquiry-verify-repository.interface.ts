export interface IInquiryVerifyRepository {
  isExistInquiryRequestId(id: string): Promise<boolean>;
}
