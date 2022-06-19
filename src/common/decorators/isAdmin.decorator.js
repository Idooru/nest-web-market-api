"use strict";
exports.__esModule = true;
exports.IsAdmin = void 0;
var common_1 = require("@nestjs/common");
var common_2 = require("@nestjs/common");
exports.IsAdmin = (0, common_1.createParamDecorator)(function (data, context) {
    var req = context.switchToHttp().getRequest();
    var user = req.user;
    if (user.userType !== "admin") {
        throw new common_2.UnauthorizedException("admin 계정만 수행 할 수 있는 작업입니다.");
    }
});
