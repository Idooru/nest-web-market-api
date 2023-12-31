import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LibraryModule } from "../../common/lib/library.module";
import { CartModule } from "../cart/cart.module";
import { UserModule } from "../user/user.module";
import { OrderEntity } from "./entities/order.entity";
import { OrderV1ClientContoller } from "./controllers/v1/order-v1-client.contoller";
import { OrderRepositoryVo } from "./logic/transaction/order-repository.vo";
import { OrderQueryRunnerProvider } from "./logic/transaction/order-query-runner.provider";
import { OrderTransaction } from "./logic/transaction/order.transaction";
import { OrderUpdateService } from "./services/order-update.service";
import { OrderUpdateRepository } from "./repositories/order-update.repository";
import { PaymentEntitiy } from "./entities/payment.entitiy";

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, PaymentEntitiy]),
    LibraryModule,
    forwardRef(() => CartModule),
    UserModule,
  ],
  controllers: [OrderV1ClientContoller],
  providers: [
    OrderRepositoryVo,
    OrderQueryRunnerProvider,
    OrderTransaction,
    OrderUpdateService,
    OrderUpdateRepository,
  ],
})
export class OrderModule {}
