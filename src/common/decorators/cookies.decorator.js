"use strict";
exports.__esModule = true;
exports.Cookies = void 0;
var common_1 = require("@nestjs/common");
exports.Cookies = (0, common_1.createParamDecorator)(function (data, context) {
    var req = context.switchToHttp().getRequest();
    try {
        return req.signedCookies[data] ? req.signedCookies[data] : null;
    }
    catch (err) {
        throw new common_1.NotFoundException("쿠키가 변조 되었습니다.");
    }
});
