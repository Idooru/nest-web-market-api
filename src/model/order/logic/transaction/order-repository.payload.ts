import { CartEntity } from "../../../cart/entities/cart.entity";
import { Repository } from "typeorm";
import { ProductEntity } from "../../../product/entities/product.entity";
import { OrderEntity } from "../../entities/order.entity";
import { PaymentEntity } from "../../entities/payment.entity";
import { AccountEntity } from "../../../account/entities/account.entity";

export interface OrderRepositoryPayload {
  order: Repository<OrderEntity>;
  cart: Repository<CartEntity>;
  product: Repository<ProductEntity>;
  payment: Repository<PaymentEntity>;
  account: Repository<AccountEntity>;
}
