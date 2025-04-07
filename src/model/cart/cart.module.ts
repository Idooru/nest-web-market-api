import { forwardRef, Module } from "@nestjs/common";
import { CartV1ClientController } from "./controllers/v1/cart-v1-client.controller";
import { CartService } from "./services/cart.service";
import { CartSearchRepository } from "./repositories/cart-search.repository";
import { CartUpdateRepository } from "./repositories/cart-update.repository";
import { CartSearcher } from "./logic/cart.searcher";
import { LibraryModule } from "../../common/lib/library.module";
import { ProductModule } from "../product/product.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CartEntity } from "./entities/cart.entity";
import { UserModule } from "../user/user.module";
import { cartSelect } from "../../common/config/repository-select-configs/cart.select";
import { CartValidator } from "./logic/cart.validator";
import { CartValidateRepository } from "./repositories/cart-validate.repository";
import { OrderModule } from "../order/order.module";
import { MediaModule } from "../media/media.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([CartEntity]),
    forwardRef(() => OrderModule),
    LibraryModule,
    UserModule,
    ProductModule,
    MediaModule,
  ],
  controllers: [CartV1ClientController],
  providers: [
    { provide: "cart-select", useValue: cartSelect },
    CartService,
    CartSearchRepository,
    CartUpdateRepository,
    CartValidateRepository,
    CartSearcher,
    CartValidator,
  ],
  exports: [CartSearcher, CartService],
})
export class CartModule {}
