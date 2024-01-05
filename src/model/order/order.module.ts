import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LibraryModule } from "../../common/lib/library.module";
import { CartModule } from "../cart/cart.module";
import { UserModule } from "../user/user.module";
import { OrderEntity } from "./entities/order.entity";
import { OrderV1ClientContoller } from "./controllers/v1/order-v1-client.contoller";
import { OrderTransactionInitializer } from "./logic/transaction/order-transaction.initializer";
import { OrderTransaction } from "./logic/transaction/order.transaction";
import { OrderUpdateService } from "./services/order-update.service";
import { OrderUpdateRepository } from "./repositories/order-update.repository";
import { PaymentEntitiy } from "./entities/payment.entitiy";
import { AccountModule } from "../account/account.module";
import { Transactional } from "../../common/interfaces/initializer/transactional";

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, PaymentEntitiy]),
    LibraryModule,
    forwardRef(() => CartModule),
    UserModule,
    AccountModule,
  ],
  controllers: [OrderV1ClientContoller],
  providers: [
    { provide: Transactional, useClass: OrderTransactionInitializer },
    OrderTransactionInitializer,
    OrderTransaction,
    OrderUpdateService,
    OrderUpdateRepository,
  ],
})
export class OrderModule {}
