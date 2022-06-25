import { UserActivityEntity } from "./../../model/user/entities/user.activity.entity";
import {
  ImagesEntity,
  VideosEntity,
} from "./../../model/upload/entities/upload.entity";
import { ProductEntity } from "./../../model/product/product.entity";
import { UserCommonEntity } from "../../model/user/entities/user.common.entity";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

import * as dotenv from "dotenv";
import { UserAuthEntity } from "src/model/user/entities/user.auth.entity";
import { UserCoreEntity } from "src/model/user/entities/user.core.entity";
dotenv.config();

export const typeORMConfig: TypeOrmModuleOptions = {
  type: "mysql",
  host: process.env.MYSQL_HOST,
  port: 3306,
  username: "admin",
  password: process.env.MYSQL_PASSWORD,
  database: "nestWebMarket_API",
  entities: [
    UserCoreEntity,
    UserCommonEntity,
    UserAuthEntity,
    UserActivityEntity,
    ProductEntity,
    ImagesEntity,
    VideosEntity,
  ],
  synchronize: true,
  logging: false,
  keepConnectionAlive: true,
};
