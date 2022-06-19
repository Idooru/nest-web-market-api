"use strict";
exports.__esModule = true;
exports.typeORMConfig = void 0;
var upload_entity_1 = require("./../../model/upload/entities/upload.entity");
var product_entity_1 = require("./../../model/product/product.entity");
var user_entity_1 = require("../../model/user/entities/user.entity");
var dotenv = require("dotenv");
dotenv.config();
exports.typeORMConfig = {
    type: "mysql",
    host: process.env.MYSQL_HOST,
    port: 3306,
    username: "admin",
    password: process.env.MYSQL_PASSWORD,
    database: "nestWebMarket_API",
    entities: [user_entity_1.UserEntity, product_entity_1.ProductEntity, upload_entity_1.ImagesEntity, upload_entity_1.VideosEntity],
    synchronize: true
};
