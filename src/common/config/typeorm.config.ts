import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { UserEntity } from "src/model/user/entities/user.entity";
import { UserProfileEntity } from "src/model/user/entities/user.profile.entity";
import { UserActivityEntity } from "src/model/user/entities/user.activity.entity";
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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: new ConfigService().get("MYSQL_HOST"),
      port: 3306,
      username: new ConfigService().get("MYSQL_USERNAME"),
      password: new ConfigService().get("MYSQL_PASSWORD"),
      database: "nestWebMarket_API",
      entities: [
        UserEntity,
        UserProfileEntity,
        UserAuthEntity,
        UserActivityEntity,
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
      migrations: [__dirname, "/src/migrations/*.ts"],
      cli: { migrationsDir: "src/migrations" },
      synchronize: false,
      logging: false,
      keepConnectionAlive: true,
    }),
  ],
})
export class TypeormConfigurationModule {}
