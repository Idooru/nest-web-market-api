import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LibraryModule } from "../../common/lib/library.module";
import { CartModule } from "../cart/cart.module";
import { UserModule } from "../user/user.module";
import { OrderEntity } from "./entities/order.entity";
import { OrderV1ClientController } from "./controllers/v1/order-v1-client.contoller";
import { OrderTransactionInitializer } from "./logic/transaction/order-transaction.initializer";
import { OrderTransactionExecutor } from "./logic/transaction/order-transaction.executor";
import { OrderService } from "./services/order.service";
import { OrderUpdateRepository } from "./repositories/order-update.repository";
import { PaymentEntity } from "./entities/payment.entity";
import { AccountModule } from "../account/account.module";
import { Transactional } from "../../common/interfaces/initializer/transactional";
import { OrderTransactionSearcher } from "./logic/transaction/order-transaction.searcher";
import { OrderTransactionContext } from "./logic/transaction/order-transaction.context";
import { OrderSearcher } from "./logic/order.searcher";
import { OrderSearchRepository } from "./repositories/order-search.repository";
import { orderSelect } from "../../common/config/repository-select-configs/order.select";
import { ProductModule } from "../product/product.module";

const surtaxPrice = { provide: "surtax-price", useValue: 5000 };

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, PaymentEntity]),
    forwardRef(() => CartModule),
    LibraryModule,
    UserModule,
    AccountModule,
    ProductModule,
  ],
  controllers: [OrderV1ClientController],
  providers: [
    { provide: "order-select", useValue: orderSelect },
    { provide: Transactional, useClass: OrderTransactionInitializer },
    surtaxPrice,
    OrderTransactionInitializer,
    OrderTransactionExecutor,
    OrderTransactionSearcher,
    OrderTransactionContext,
    OrderSearcher,
    OrderService,
    OrderSearchRepository,
    OrderUpdateRepository,
  ],
})
export class OrderModule {}
