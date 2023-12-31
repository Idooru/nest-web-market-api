import { CartEntity } from "../../../cart/entities/cart.entity";
import { Repository } from "typeorm";
import { ProductEntity } from "../../../product/entities/product.entity";
import { OrderEntity } from "../../entities/order.entity";
import { PaymentEntitiy } from "../../entities/payment.entitiy";

export interface OrderRepositoryPayload {
  orderRepository: Repository<OrderEntity>;
  cartRepository: Repository<CartEntity>;
  productRepository: Repository<ProductEntity>;
  paymentRepository: Repository<PaymentEntitiy>;
}

export class OrderRepositoryVo {
  private _orderRepository: Repository<OrderEntity>;
  private _cartRepository: Repository<CartEntity>;
  private _productRepository: Repository<ProductEntity>;
  private _paymentRepository: Repository<PaymentEntitiy>;

  public setRepositoryPayload(repositoryPayload: OrderRepositoryPayload): void {
    const {
      orderRepository,
      cartRepository,
      productRepository,
      paymentRepository,
    } = repositoryPayload;

    this.orderRepository = orderRepository;
    this.cartRepository = cartRepository;
    this.productRepository = productRepository;
    this.paymentRepository = paymentRepository;
  }

  get orderRepository(): Repository<OrderEntity> {
    return this._orderRepository;
  }

  set orderRepository(value: Repository<OrderEntity>) {
    this._orderRepository = value;
  }

  get cartRepository(): Repository<CartEntity> {
    return this._cartRepository;
  }

  set cartRepository(value: Repository<CartEntity>) {
    this._cartRepository = value;
  }

  get productRepository(): Repository<ProductEntity> {
    return this._productRepository;
  }

  set productRepository(value: Repository<ProductEntity>) {
    this._productRepository = value;
  }

  get paymentRepository(): Repository<PaymentEntitiy> {
    return this._paymentRepository;
  }

  set paymentRepository(value: Repository<PaymentEntitiy>) {
    this._paymentRepository = value;
  }
}
