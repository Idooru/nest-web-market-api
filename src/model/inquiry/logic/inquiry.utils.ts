import { Injectable } from "@nestjs/common";
import { ProductSearcher } from "../../product/logic/product.searcher";
import { UserSearcher } from "../../user/logic/user.searcher";
import { ProductEntity } from "../../product/entities/product.entity";
import { ClientUserEntity } from "../../user/entities/client-user.entity";
import { AdminUserEntity } from "../../user/entities/admin-user.entity";

@Injectable()
export class InquiryUtils {
  constructor(
    private readonly productSearcher: ProductSearcher,
    private readonly userSearcher: UserSearcher,
  ) {}

  public getProductAndClient(
    productId: string,
    userId: string,
  ): Promise<[ProductEntity, ClientUserEntity]> {
    return Promise.all([
      this.productSearcher.findProductWithId(productId),
      this.userSearcher.findClientUserObjectWithId(userId),
    ]);
  }

  public getUsers(
    inquiryRequesterId: string,
    inquiryResponserId: string,
  ): Promise<[ClientUserEntity, AdminUserEntity]> {
    return Promise.all([
      this.userSearcher.findClientUserObjectWithId(inquiryRequesterId),
      this.userSearcher.findAdminUserObjectWithId(inquiryResponserId),
    ]);
  }
}
