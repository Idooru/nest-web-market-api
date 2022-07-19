import { ReviewsEntity } from "./../../model/review/entities/review.entity";
import { ProductsEntity } from "./../../model/product/entities/product.entity";
import { UserProfileEntity } from "../../model/user/entities/user.profile.entity";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { UserActivityEntity } from "src/model/user/entities/user.activity.entity";
import { UserAuthEntity } from "src/model/user/entities/user.auth.entity";
import { UsersEntity } from "src/model/user/entities/user.entity";
import { StarRatingEntity } from "../../model/review/entities/star-rating.entity";
import { ProductsImageEntity } from "src/model/upload/entities/product.image.entity";
import { ReviewsImageEntity } from "src/model/upload/entities/review.image.entity";
import { ReviewsVideoEntity } from "src/model/upload/entities/review.video.entity";

import { ConfigService } from "@nestjs/config";
import { InquiriesEntity } from "../../model/inquiry/entities/inquiry.entity";
import { InquiriesImageEntity } from "../../model/inquiry/entities/inquiry.image.entity";
import { InquiriesVideoEntity } from "../../model/inquiry/entities/inquiry.video.entity";

export const typeORMConfig: TypeOrmModuleOptions = {
  type: "mysql",
  host: new ConfigService().get("MYSQL_HOST"),
  port: 3306,
  username: "admin",
  password: new ConfigService().get("MYSQL_PASSWORD"),
  database: "nestWebMarket_API",
  entities: [
    UsersEntity,
    UserProfileEntity,
    UserAuthEntity,
    UserActivityEntity,
    ProductsEntity,
    ProductsImageEntity,
    StarRatingEntity,
    ReviewsEntity,
    ReviewsImageEntity,
    ReviewsVideoEntity,
    InquiriesEntity,
    InquiriesImageEntity,
    InquiriesVideoEntity,
  ],
  migrations: [__dirname, "/src/migrations/*.ts"],
  cli: { migrationsDir: "src/migrations" },
  synchronize: true,
  logging: true,
  keepConnectionAlive: true,
};
