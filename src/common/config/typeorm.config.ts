import { ReviewEntity } from "src/model/review/entities/review.entity";
import { ProductEntity } from "./../../model/product/entities/product.entity";
import { UserProfileEntity } from "../../model/user/entities/user.profile.entity";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { UserActivityEntity } from "src/model/user/entities/user.activity.entity";
import { UserAuthEntity } from "src/model/user/entities/user.auth.entity";
import { UserEntity } from "src/model/user/entities/user.entity";
import { StarRatingEntity } from "../../model/review/entities/star-rating.entity";
import { ProductImageEntity } from "src/model/upload/entities/product.image.entity";
import { ReviewImageEntity } from "src/model/upload/entities/review.image.entity";
import { ReviewVideoEntity } from "src/model/upload/entities/review.video.entity";
import { ConfigService } from "@nestjs/config";
import { InquiryEntity } from "../../model/inquiry/entities/inquiry.entity";
import { InquiryImageEntity } from "../../model/inquiry/entities/inquiry.image.entity";
import { InquiryVideoEntity } from "../../model/inquiry/entities/inquiry.video.entity";

export const typeORMConfig: TypeOrmModuleOptions = {
  type: "mysql",
  host: new ConfigService().get("MYSQL_HOST"),
  port: 3306,
  username: "admin",
  password: new ConfigService().get("MYSQL_PASSWORD"),
  database: "nestWebMarket_API",
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
  synchronize: true,
  logging: true,
  keepConnectionAlive: true,
};
