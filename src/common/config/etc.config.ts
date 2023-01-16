import { ReviewEntity } from "src/model/review/entities/review.entity";
import { ProductEntity } from "../../model/product/entities/product.entity";
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
import { Injectable } from "@nestjs/common";
import { CookieOptions } from "express";
import { JwtModuleOptions } from "@nestjs/jwt";

@Injectable()
export class EtcConfig {
  typeOrmConfig: TypeOrmModuleOptions = {
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
  };

  cookieOption: CookieOptions = {
    httpOnly: true,
    signed: true,
    expires: new Date(Date.now() + 10000000000),
  };

  jwtOptions: JwtModuleOptions = {
    secret: new ConfigService().get("JWT_SECRET"),
  };

  returnPropertyWithSelect: ReturnPropertyWithSelect = {
    productsReturnProperty: [
      "product.name",
      "product.price",
      "product.type",
      "Image.url",
      "StarRating.averageScore",
      "Review",
      "Inquiry",
      "UserActivity.id",
    ],
    productReturnProperty: [
      "product.id",
      "product.name",
      "product.price",
      "product.origin",
      "product.type",
      "product.description",
      "Image.url",
      "StarRating.averageScore",
      "product.createdAt",
      "product.updatedAt",
      "Review",
      "Inquiry",
      "UserActivity.id",
      "ReviewImage.url",
      "ReviewVideo.url",
    ],
    productReturnWithStarRating: [
      "product.id",
      "product.name",
      "product.price",
      "product.origin",
      "product.type",
      "product.description",
      "Image.url",
      "StarRating.id",
      "StarRating.averageScore",
      "product.createdAt",
      "product.updatedAt",
    ],
    userInformationReturnProperty: [
      "Profile.realname",
      "Auth.nickname",
      "Profile.birth",
      "Profile.gender",
      "Auth.email",
      "Profile.phonenumber",
      "Auth.userType",
      "Activity.purchaseCount",
      "Activity.bonusPoint",
      "Activity.productInquiryCount",
      "Activity.productReviewCount",
    ],
  };
}

type ReturnPropertyWithSelect = {
  productsReturnProperty: string[];
  productReturnProperty: string[];
  productReturnWithStarRating: string[];
  userInformationReturnProperty: string[];
};
