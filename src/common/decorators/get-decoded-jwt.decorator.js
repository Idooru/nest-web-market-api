"use strict";
exports.__esModule = true;
exports.GetDecodedJwt = void 0;
var common_1 = require("@nestjs/common");
exports.GetDecodedJwt = (0, common_1.createParamDecorator)(function (data, context) {
    var req = context.switchToHttp().getRequest();
    return req.user;
});
