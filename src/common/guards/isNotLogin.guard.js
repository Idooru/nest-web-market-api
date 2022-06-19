"use strict";
exports.__esModule = true;
exports.IsNotLoginGuard = void 0;
var common_1 = require("@nestjs/common");
var IsNotLoginGuard = /** @class */ (function () {
    function IsNotLoginGuard() {
    }
    IsNotLoginGuard.prototype.canActivate = function (context) {
        var req = context.switchToHttp().getRequest();
        if (req.signedCookies.JWT_COOKIE) {
            throw new common_1.BadRequestException("현재 로그인 중이므로 해당 작업을 수행할 수 없습니다.");
        }
        return true;
    };
    return IsNotLoginGuard;
}());
exports.IsNotLoginGuard = IsNotLoginGuard;
