export interface IReviewVerifyRepository {
  isExistReviewId(id: string): Promise<boolean>;
}
