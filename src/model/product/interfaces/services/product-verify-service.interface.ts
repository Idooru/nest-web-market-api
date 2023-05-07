export interface IProductVerifyService {
  isExistProductId(id: string): Promise<void>;
  isNotExistProductName(name: string): Promise<void>;
}
