import { Module } from "@nestjs/common";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { UserProfileEntity } from "src/model/user/entities/user-profile.entity";
import { UserAuthEntity } from "src/model/user/entities/user-auth.entity";
import { ProductEntity } from "src/model/product/entities/product.entity";
import { StarRateEntity } from "src/model/review/entities/star-rate.entity";
import { ReviewEntity } from "src/model/review/entities/review.entity";
import { InquiryRequestEntity } from "src/model/inquiry/entities/inquiry-request.entity";
import { ProductImageEntity } from "src/model/media/entities/product-image.entity";
import { ReviewImageEntity } from "src/model/media/entities/review-image.entity";
import { ReviewVideoEntity } from "src/model/media/entities/review-video.entity";
import { InquiryRequestImageEntity } from "src/model/media/entities/inquiry-request-image.entity";
import { InquiryRequestVideoEntity } from "src/model/media/entities/inquiry-request-video.entity";
import { AdminUserEntity } from "src/model/user/entities/admin-user.entity";
import { ClientUserEntity } from "src/model/user/entities/client-user.entity";
import { UserEntity } from "../../../model/user/entities/user.entity";
import { InquiryResponseEntity } from "src/model/inquiry/entities/inquiry-response.entity";
import { InquiryResponseImageEntity } from "src/model/media/entities/inquiry-response-image.entity";
import { InquiryResponseVideoEntity } from "src/model/media/entities/inquiry-response-video.entity";
import { CartEntity } from "../../../model/cart/entities/cart.entity";
import { OrderEntity } from "../../../model/order/entities/order.entity";
import { PaymentEntity } from "../../../model/order/entities/payment.entity";
import { AccountEntity } from "../../../model/account/entities/account.entity";

const isNodeEnvDev = (): boolean => process.env.NODE_ENV === "dev";
const isNodeEnvProd = (): boolean => process.env.NODE_ENV === "prod";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: "mysql",
        host: configService.get("DB_HOST"),
        port: configService.get("DB_PORT"),
        username: configService.get("DB_USERNAME"),
        password: configService.get("DB_PASSWORD"),
        database: configService.get("DB_SCHEMA"),
        entities: [
          UserEntity,
          UserProfileEntity,
          UserAuthEntity,
          ClientUserEntity,
          AdminUserEntity,
          ProductEntity,
          ProductImageEntity,
          StarRateEntity,
          ReviewEntity,
          ReviewImageEntity,
          ReviewVideoEntity,
          InquiryRequestEntity,
          InquiryRequestImageEntity,
          InquiryRequestVideoEntity,
          InquiryResponseEntity,
          InquiryResponseImageEntity,
          InquiryResponseVideoEntity,
          CartEntity,
          OrderEntity,
          PaymentEntity,
          AccountEntity,
        ],
        synchronize: isNodeEnvDev(),
        migrationsRun: isNodeEnvProd(),
        logging: isNodeEnvDev(),
        dropSchema: false,
        keepConnectionAlive: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class TypeormAdaptModule {}
