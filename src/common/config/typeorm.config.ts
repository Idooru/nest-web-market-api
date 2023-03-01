import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { UserProfileEntity } from "src/model/user/entities/user.profile.entity";
import { UserAuthEntity } from "src/model/user/entities/user.auth.entity";
import { ProductEntity } from "src/model/product/entities/product.entity";
import { StarRateEntity } from "src/model/review/entities/star-rate.entity";
import { ReviewEntity } from "src/model/review/entities/review.entity";
import { InquiryEntity } from "src/model/inquiry/entities/inquiry.entity";
import { Module } from "@nestjs/common";
import { ProductImageEntity } from "src/model/media/entities/product.image.entity";
import { ReviewImageEntity } from "src/model/media/entities/review.image.entity";
import { ReviewVideoEntity } from "src/model/media/entities/review.video.entity";
import { InquiryImageEntity } from "src/model/media/entities/inquiry.image.entity";
import { InquiryVideoEntity } from "src/model/media/entities/inquiry.video.entity";
import { AdminUserEntity } from "src/model/user/entities/admin-user.entity";
import { ClientUserEntity } from "src/model/user/entities/client-user.entity";
import { UserPrototypeEntity } from "../entities/user-prototype.entity";

const isNodeEnvDev = (): boolean =>
  process.env.NODE_ENV === "dev" ? true : false;
const isNodeEnvProd = (): boolean =>
  process.env.NODE_ENV === "prod" ? true : false;

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (
        configService: ConfigService,
      ): Promise<TypeOrmModuleOptions> => ({
        type: "mysql",
        host: configService.get("DB_HOST"),
        port: configService.get("DB_PORT"),
        username: configService.get("DB_USERNAME"),
        password: configService.get("DB_PASSWORD"),
        database: configService.get("DB_SCHEMA"),
        entities: [
          UserPrototypeEntity,
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
          InquiryEntity,
          InquiryImageEntity,
          InquiryVideoEntity,
        ],
        synchronize: isNodeEnvDev(),
        migrationsRun: isNodeEnvProd(),
        logging: false,
        dropSchema: false,
        keepConnectionAlive: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class TypeormConfigurationModule {}
