"use strict";
exports.__esModule = true;
exports.IsAdminGuard = void 0;
var common_1 = require("@nestjs/common");
var IsAdminGuard = /** @class */ (function () {
    function IsAdminGuard() {
    }
    IsAdminGuard.prototype.canActivate = function (context) {
        var req = context.switchToHttp().getRequest();
        var user = req.user;
        if (user.userType !== "admin") {
            throw new common_1.UnauthorizedException("admin 계정만 수행 할 수 있는 작업입니다.");
        }
        return true;
    };
    return IsAdminGuard;
}());
exports.IsAdminGuard = IsAdminGuard;
