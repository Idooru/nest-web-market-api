import { ReviewEntity } from "./../../model/review/entities/review.entity";
import {
  ImagesEntity,
  VideosEntity,
} from "./../../model/upload/entities/upload.entity";
import { ProductEntity } from "./../../model/product/entities/product.entity";
import { UserProfileEntity } from "../../model/user/entities/user.profile.entity";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { UserActivityEntity } from "src/model/user/entities/user.activity.entity";
import { UserAuthEntity } from "src/model/user/entities/user.auth.entity";
import { UserEntity } from "src/model/user/entities/user.entity";
import { StarRatingEntity } from "../../model/review/entities/star-rating.entity";
import { ConfigService } from "@nestjs/config";

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
    ImagesEntity,
    VideosEntity,
    ReviewEntity,
    StarRatingEntity,
  ],
  migrations: [__dirname, "/src/migrations/*.ts"],
  cli: { migrationsDir: "src/migrations" },
  synchronize: false,
  logging: true,
  keepConnectionAlive: true,
};
