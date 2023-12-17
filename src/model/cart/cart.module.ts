import { Module } from "@nestjs/common";
import { CartV1ClientControllerController } from "./controllers/v1/cart-v1-client.controller.controller";
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

@Module({
  imports: [
    TypeOrmModule.forFeature([CartEntity]),
    LibraryModule,
    UserModule,
    ProductModule,
  ],
  controllers: [CartV1ClientControllerController],
  providers: [
    { provide: "CartsSelectProperty", useValue: cartSelectProperty },
    CartUpdateService,
    CartSearchRepository,
    CartUpdateRepository,
    CartValidateRepository,
    CartSearcher,
    CartValidator,
  ],
})
export class CartModule {}
