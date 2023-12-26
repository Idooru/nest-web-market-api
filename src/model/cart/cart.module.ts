import { forwardRef, Module } from "@nestjs/common";
import { CartV1ClientController } from "./controllers/v1/cart-v1-client.controller";
import { CartUpdateService } from "./services/cart-update.service";
import { CartSearchRepository } from "./repositories/cart-search.repository";
import { CartUpdateRepository } from "./repositories/cart-update.repository";
import { CartSearcher } from "./logic/cart.searcher";
import { LibraryModule } from "../../common/lib/library.module";
import { ProductModule } from "../product/product.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CartEntity } from "./entities/cart.entity";
import { UserModule } from "../user/user.module";
import { cartSelectProperty } from "../../common/config/repository-select-configs/cart.select";
import { CartValidator } from "./logic/cart.validator";
import { CartValidateRepository } from "./repositories/cart-validate.repository";
import { PaymentModule } from "../payment/payment.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([CartEntity]),
    LibraryModule,
    forwardRef(() => PaymentModule),
    UserModule,
    ProductModule,
  ],
  controllers: [CartV1ClientController],
  providers: [
    { provide: "CartsSelectProperty", useValue: cartSelectProperty },
    CartUpdateService,
    CartSearchRepository,
    CartUpdateRepository,
    CartValidateRepository,
    CartSearcher,
    CartValidator,
  ],
  exports: [CartSearcher, CartUpdateService],
})
export class CartModule {}
