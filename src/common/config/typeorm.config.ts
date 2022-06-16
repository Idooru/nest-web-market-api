import { ProductEntity } from "./../../model/product/product.entity";
import { UserEntity } from "../../model/user/entities/user.entity";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

import * as dotenv from "dotenv";
dotenv.config();

export const typeORMConfig: TypeOrmModuleOptions = {
  type: "mysql",
  host: process.env.MYSQL_HOST,
  port: 3306,
  username: "admin",
  password: process.env.MYSQL_PASSWORD,
  database: "nestWebMarket_API",
  entities: [UserEntity],
  synchronize: true,
};
