export interface IReviewVerifyService {
  isExistReviewId(id: string): Promise<void>;
}
