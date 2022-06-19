"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var auth_module_1 = require("./model/auth/auth.module");
var user_module_1 = require("./model/user/user.module");
var product_module_1 = require("./model/product/product.module");
var logger_middleware_1 = require("./common/middlewares/logger.middleware");
var typeorm_1 = require("@nestjs/typeorm");
var typeorm_config_1 = require("./common/config/typeorm.config");
var config_1 = require("@nestjs/config");
var upload_module_1 = require("./model/upload/upload.module");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule.prototype.configure = function (consumer) {
        consumer.apply(logger_middleware_1.LoggerMiddleware).forRoutes("*");
    };
    AppModule = __decorate([
        (0, common_1.Module)({
            imports: [
                config_1.ConfigModule.forRoot({
                    isGlobal: true
                }),
                typeorm_1.TypeOrmModule.forRoot(typeorm_config_1.typeORMConfig),
                auth_module_1.AuthModule,
                user_module_1.UserModule,
                product_module_1.ProductModule,
                upload_module_1.UploadModule,
            ],
            controllers: [],
            providers: []
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
