"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AuthModule = void 0;
var user_entity_1 = require("./../user/entities/user.entity");
var typeorm_1 = require("@nestjs/typeorm");
var auth_repository_1 = require("./auth.repository");
var jwt_strategy_1 = require("./jwt.strategy");
var config_1 = require("@nestjs/config");
var user_module_1 = require("./../user/user.module");
var passport_1 = require("@nestjs/passport");
var common_1 = require("@nestjs/common");
var auth_service_1 = require("./services/auth.service");
var jwt_1 = require("@nestjs/jwt");
var common_2 = require("@nestjs/common");
var AuthModule = /** @class */ (function () {
    function AuthModule() {
    }
    AuthModule = __decorate([
        (0, common_1.Module)({
            imports: [
                config_1.ConfigModule.forRoot(),
                passport_1.PassportModule.register({ defaultStrategy: "jwt", session: false }),
                typeorm_1.TypeOrmModule.forFeature([user_entity_1.UserEntity]),
                jwt_1.JwtModule.register({
                    secret: process.env.JWT_SECRET,
                    signOptions: { expiresIn: "1m" }
                }),
                (0, common_2.forwardRef)(function () { return user_module_1.UserModule; }),
            ],
            providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy, auth_repository_1.AuthRepository],
            exports: [auth_service_1.AuthService]
        })
    ], AuthModule);
    return AuthModule;
}());
exports.AuthModule = AuthModule;
