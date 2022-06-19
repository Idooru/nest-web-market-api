"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.JwtStrategy = void 0;
var passport_1 = require("@nestjs/passport");
var passport_jwt_1 = require("passport-jwt");
var passport_jwt_2 = require("passport-jwt");
var common_1 = require("@nestjs/common");
var JwtStrategy = /** @class */ (function (_super) {
    __extends(JwtStrategy, _super);
    function JwtStrategy() {
        return _super.call(this, {
            jwtFromRequest: passport_jwt_2.ExtractJwt.fromExtractors([
                function (request) { var _a; return (_a = request === null || request === void 0 ? void 0 : request.cookies) === null || _a === void 0 ? void 0 : _a.JWT_COOKIE; },
            ]),
            secretOrKey: process.env.JWT_SECRET,
            ignoreExpiration: false
        }) || this;
    }
    JwtStrategy = __decorate([
        (0, common_1.Injectable)()
    ], JwtStrategy);
    return JwtStrategy;
}((0, passport_1.PassportStrategy)(passport_jwt_1.Strategy)));
exports.JwtStrategy = JwtStrategy;
