export interface IProductVerifyRepository {
  isExistProductId(id: string): Promise<boolean>;
  isNotExistProductName(name: string): Promise<boolean>;
}
