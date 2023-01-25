import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { UserEntity } from "src/model/user/entities/user.entity";
import { UserProfileEntity } from "src/model/user/entities/user.profile.entity";
import { UserActivityEntity } from "src/model/user/entities/user.activity.entity";
import { UserAuthEntity } from "src/model/user/entities/user.auth.entity";
import { ProductEntity } from "src/model/product/entities/product.entity";
import { ProductImageEntity } from "src/model/upload/entities/product.image.entity";
import { StarRatingEntity } from "src/model/review/entities/star-rating.entity";
import { ReviewEntity } from "src/model/review/entities/review.entity";
import { ReviewImageEntity } from "src/model/upload/entities/review.image.entity";
import { ReviewVideoEntity } from "src/model/upload/entities/review.video.entity";
import { InquiryEntity } from "src/model/inquiry/entities/inquiry.entity";
import { InquiryImageEntity } from "src/model/inquiry/entities/inquiry.image.entity";
import { InquiryVideoEntity } from "src/model/inquiry/entities/inquiry.video.entity";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: new ConfigService().get("MYSQL_HOST"),
      port: 3306,
      username: new ConfigService().get("MYSQL_USERNAME"),
      password: new ConfigService().get("MYSQL_PASSWORD"),
      database: "nestWebMarket-API",
      entities: [
        UserEntity,
        UserProfileEntity,
        UserAuthEntity,
        UserActivityEntity,
        ProductEntity,
        ProductImageEntity,
        StarRatingEntity,
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
      logging: true,
      keepConnectionAlive: true,
    }),
  ],
})
export class TypeormConfigurationModule {}
